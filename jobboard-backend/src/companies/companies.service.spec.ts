import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Advertisements } from '../advertisements/entities/advertisement.entity';
import { UsersService } from '../users/users.service';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

const mockManager = {
  delete: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  transaction: jest.fn().mockImplementation(async (callback) => {
    return await callback(mockManager);
  }),
};

const mockCompanyRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  manager: mockManager,
};

const mockAdvertisementsRepository = {
  remove: jest.fn(),
};

const mockUsersService = {
  addUserToCompanyWithUserId: jest.fn(),
};

describe('CompaniesService', () => {
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
        {
          provide: getRepositoryToken(Advertisements),
          useValue: mockAdvertisementsRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a company and add user to it', async () => {
      const userId = 'user-id';

      const createCompanyDto: CreateCompanyDto = {
        name: 'Gecko',
        logo_url:
          'https://upload.wikimedia.org/wikipedia/fr/2/22/Mozillagecko-logo.gif',
        address: 'San Francisco, Californie, États-Unis',
        nb_of_employees: 700,
      };

      const savedCompany = { ...createCompanyDto, id: 'new-company-id' };

      mockCompanyRepository.findOne.mockResolvedValue(null);
      mockCompanyRepository.find.mockResolvedValue([]);
      mockCompanyRepository.create.mockReturnValue(savedCompany);
      mockCompanyRepository.save.mockResolvedValue(savedCompany);
      mockUsersService.addUserToCompanyWithUserId.mockResolvedValue(null);

      const result = await service.create(userId, createCompanyDto);

      expect(result).toEqual({
        message: 'Company created successfully and user added to the company',
      });
      expect(mockCompanyRepository.save).toHaveBeenCalled();
      expect(mockUsersService.addUserToCompanyWithUserId).toHaveBeenCalledWith(
        userId,
        savedCompany.id,
      );
    });

    it('should throw an error if company name already exists', async () => {
      const userId = 'user-id';
      const createCompanyDto: CreateCompanyDto = {
        name: 'Gecko',
        logo_url:
          'https://upload.wikimedia.org/wikipedia/fr/2/22/Mozillagecko-logo.gif',
        address: 'San Francisco, Californie, États-Unis',
        nb_of_employees: 700,
      };

      mockCompanyRepository.findOne.mockResolvedValue(createCompanyDto);

      await expect(service.create(userId, createCompanyDto)).rejects.toThrow(
        new HttpException(
          'Company with this name already exist',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if user already has a company', async () => {
      const userId = 'user-id';
      const createCompanyDto: CreateCompanyDto = {
        name: 'Gecko',
        logo_url:
          'https://upload.wikimedia.org/wikipedia/fr/2/22/Mozillagecko-logo.gif',
        address: 'San Francisco, Californie, États-Unis',
        nb_of_employees: 700,
      };

      mockCompanyRepository.findOne.mockResolvedValue(null);
      mockCompanyRepository.find.mockResolvedValue([{}]); // Simule un utilisateur qui a déjà une entreprise

      await expect(service.create(userId, createCompanyDto)).rejects.toThrow(
        new HttpException(
          'User already have a company',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('findById', () => {
    it('should return a company by id', async () => {
      const companyId = 'company-id';
      const company = { id: companyId, name: 'Company Name' };

      mockCompanyRepository.findOne.mockResolvedValue(company);

      const result = await service.findById(companyId);
      expect(result).toEqual(company);
    });

    it('should throw an error if company not found', async () => {
      const companyId = 'invalid-id';

      mockCompanyRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(companyId)).rejects.toThrow(
        new HttpException('Company not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteCompany', () => {
    it('should remove a company and related advertisements and users', async () => {
      const companyId = 'company-id';
      const company = {
        id: companyId,
        advertisements: [{ id: 'ad-1' }, { id: 'ad-2' }],
        users: [{ id: 'user-1' }, { id: 'user-2' }],
      };

      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockManager.delete.mockResolvedValue(undefined);
      mockManager.remove.mockResolvedValue(undefined);
      mockManager.update.mockResolvedValue(undefined);

      const result = await service.deleteCompany(companyId);

      expect(result).toEqual({ message: 'Company removed successfully' });
      expect(mockManager.delete).toHaveBeenCalledTimes(3); // 2 ads + 1 company
      expect(mockManager.update).toHaveBeenCalledTimes(2); // 2 users
    });

    it('should throw an error if company not found', async () => {
      const companyId = 'invalid-id';

      mockCompanyRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteCompany(companyId)).rejects.toThrow(
        new HttpException('Company not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should handle error during deletion process', async () => {
      const companyId = 'company-id';
      const company = {
        id: companyId,
        advertisements: [{ id: 'ad-1' }],
        users: [{ id: 'user-1' }],
      };

      mockCompanyRepository.findOne.mockResolvedValue(company);
      mockManager.transaction.mockImplementation(async () => {
        throw new Error('Transaction error');
      });

      await expect(service.deleteCompany(companyId)).rejects.toThrow(
        new HttpException(
          'Transaction error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
