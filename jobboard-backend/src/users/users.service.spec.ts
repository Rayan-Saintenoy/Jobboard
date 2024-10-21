import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from '../companies/entities/company.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

interface UserRepository {
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  manager: {
    transaction: jest.Mock;
  };
}

interface CompanyRepository {
  findOne: jest.Mock;
}

describe('UsersService', () => {
  let service: UsersService;
  let userRepositoryMock: UserRepository;
  let companyRepositoryMock: CompanyRepository;

  beforeEach(async () => {
    userRepositoryMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      manager: {
        transaction: jest.fn(),
      },
    };

    companyRepositoryMock = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: getRepositoryToken(Company),
          useValue: companyRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: '123456',
        phoneNumber: '+33123456789',
        firstname: 'John',
        lastname: 'Doe',
      };
      userRepositoryMock.findOne.mockResolvedValue(null);
      userRepositoryMock.save.mockResolvedValue({
        ...createUserDto,
        password: 'hashedPassword',
      });

      const result = await service.create(createUserDto);
      expect(result).toEqual({ message: 'Account created successfully' });
    });

    it('should throw an error if user already exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: '123456',
        phoneNumber: '+33123456789',
        firstname: 'John',
        lastname: 'Doe',
      };
      userRepositoryMock.findOne.mockResolvedValue({ id: 1 });

      await expect(service.create(createUserDto)).rejects.toThrow(
        HttpException,
      );
      await expect(service.create(createUserDto)).rejects.toThrow(
        'User with this email already exist',
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'test@example.com' };
      userRepositoryMock.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(user);
    });

    it('should throw an error if user not found', async () => {
      userRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        HttpException,
      );
      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('setUsersAsRecruiters', () => {
    it('should set user as recruiter', async () => {
      const user = { id: 'user1', is_recruiter: false };
      userRepositoryMock.findOne.mockResolvedValue(user);
      userRepositoryMock.save.mockResolvedValue({
        ...user,
        is_recruiter: true,
      });

      const result = await service.setUsersAsRecruiters('user1');
      expect(result).toEqual({ message: 'User successfully set as recruiter' });
    });

    it('should throw an error if user not found', async () => {
      userRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.setUsersAsRecruiters('user1')).rejects.toThrow(
        HttpException,
      );
      await expect(service.setUsersAsRecruiters('user1')).rejects.toThrow(
        'User not found',
      );
    });
  });
});
