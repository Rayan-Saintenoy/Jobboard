import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JobApplication } from '../job_application/entities/job_application.entity';
import { User } from '../users/entities/user.entity';
import { AdvertisementsService } from './advertisements.service';
import { Advertisements } from './entities/advertisement.entity';

describe('AdvertisementsService', () => {
  let service: AdvertisementsService;

  const mockAdvertisementsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
    manager: {
      transaction: jest.fn(),
    },
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockJobApplicationRepository = {
    delete: jest.fn(),
  };

  const mockEntityManager = {
    delete: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdvertisementsService,
        {
          provide: getRepositoryToken(Advertisements),
          useValue: mockAdvertisementsRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(JobApplication),
          useValue: mockJobApplicationRepository,
        },
        {
          provide: 'EntityManager', // Mocking the EntityManager directly
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<AdvertisementsService>(AdvertisementsService);
  });
  describe('create', () => {
    it('should create an advertisement successfully', async () => {
      const userId = 'user-id';
      const createAdvertisementsDto = {
        title: 'Développeur fullstack H/F',
        description: 'Description here',
        salary: 3500,
        place: 'Lille',
        working_time: 35,
        skills: ['NodeJs', 'ReactJs'],
      };

      mockUserRepository.findOne.mockResolvedValue({
        id: userId,
        company: { id: 'company-id' },
      });
      mockAdvertisementsRepository.save.mockResolvedValue({
        id: 'advertisement-id',
      });

      const result = await service.create(createAdvertisementsDto, userId);

      expect(result).toEqual({ message: 'Advertisement created successfully' });
      expect(mockAdvertisementsRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if user is not found', async () => {
      const userId = 'invalid-user-id';
      const createAdvertisementsDto = {
        title: 'Développeur fullstack H/F',
        description: 'Description here',
        salary: 3500,
        place: 'Lille',
        working_time: 35,
        skills: ['NodeJs', 'ReactJs'],
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create(createAdvertisementsDto, userId),
      ).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getNumberOfAdvertisements', () => {
    it('should return the count of advertisements', async () => {
      mockAdvertisementsRepository.count.mockResolvedValue(10);

      const result = await service.getNumberOfAdvertisements();

      expect(result).toEqual(10);
    });
  });

  describe('findById', () => {
    it('should return an advertisement by id', async () => {
      const advertisementId = 'advertisement-id';
      const advertisement = { id: advertisementId, title: 'Test Title' };

      mockAdvertisementsRepository.findOne.mockResolvedValue(advertisement);

      const result = await service.findById(advertisementId);

      expect(result).toEqual(advertisement);
    });

    it('should throw an error if advertisement is not found', async () => {
      const advertisementId = 'invalid-id';

      mockAdvertisementsRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(advertisementId)).rejects.toThrow(
        new HttpException('Advertisement not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findAllAdvertisementsWithApplicationForCompany', () => {
    it('should return advertisements for a company with applications', async () => {
      const userId = 'user-id';
      const mockUser = {
        id: userId,
        company: { id: 'company-id' },
      };
      const mockAdvertisements = [
        {
          id: 'advertisement-id',
          title: 'Dev Job',
          jobApplications: [
            {
              id: 'application-id',
              user: {
                id: 'user-id',
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@example.com',
                phoneNumber: '123456789',
              },
            },
          ],
        },
      ];

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockAdvertisementsRepository.find.mockResolvedValue(mockAdvertisements);

      const result =
        await service.findAllAdvertisementsWithApplicationForCompany(userId);

      expect(result).toEqual(mockAdvertisements);
      expect(mockAdvertisementsRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if no advertisements found for the company', async () => {
      const userId = 'user-id';
      const mockUser = { id: userId, company: { id: 'company-id' } };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockAdvertisementsRepository.find.mockResolvedValue([]);

      await expect(
        service.findAllAdvertisementsWithApplicationForCompany(userId),
      ).rejects.toThrow(
        new HttpException(
          'No advertisements found for this company',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('update', () => {
    it('should update an advertisement successfully', async () => {
      const advertisementId = 'advertisement-id';
      const updateAdvertisementsDto = {
        title: 'Updated Title',
      };
      const existingAdvertisement = { id: advertisementId, title: 'Old Title' };

      mockAdvertisementsRepository.findOne.mockResolvedValue(
        existingAdvertisement,
      );
      mockAdvertisementsRepository.save.mockResolvedValue({
        ...existingAdvertisement,
        ...updateAdvertisementsDto,
      });

      const result = await service.update(
        advertisementId,
        updateAdvertisementsDto,
      );

      expect(result).toEqual({ message: 'Advertisement updated successfully' });
      expect(mockAdvertisementsRepository.save).toHaveBeenCalledWith({
        ...existingAdvertisement,
        ...updateAdvertisementsDto,
      });
    });

    it('should throw an error if advertisement is not found', async () => {
      const advertisementId = 'invalid-id';
      const updateAdvertisementsDto = { title: 'Updated Title' };

      mockAdvertisementsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(advertisementId, updateAdvertisementsDto),
      ).rejects.toThrow(
        new HttpException('Advertisement not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('delete', () => {
    it('should delete an advertisement successfully', async () => {
      const advertisementId = 'advertisement-id';
      const existingAdvertisement = {
        id: advertisementId,
        jobApplications: [{ id: 'application-id' }],
      };

      // Mock the behavior of findOne to return the advertisement
      mockAdvertisementsRepository.findOne.mockResolvedValue(
        existingAdvertisement,
      );

      // Mock the transaction method to execute the delete logic
      mockAdvertisementsRepository.manager.transaction.mockImplementation(
        async (callback) => {
          await callback(mockEntityManager);
        },
      );

      // Call the delete method
      const result = await service.delete(advertisementId);

      // Assertions
      expect(result).toEqual({ message: 'Advertisement deleted successfully' });
      expect(mockEntityManager.delete).toHaveBeenCalledWith(JobApplication, {
        advertisements: existingAdvertisement,
      });
      mockAdvertisementsRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(advertisementId)).rejects.toThrow(
        new HttpException('Advertisement not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
