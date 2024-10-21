import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Advertisements } from '../advertisements/entities/advertisement.entity';
import { User } from '../users/entities/user.entity';
import { JobApplication } from './entities/job_application.entity';
import { JobApplicationService } from './job_application.service';

describe('JobApplicationService', () => {
  let service: JobApplicationService;
  let userRepository;
  let advertisementsRepository;
  let jobApplicationRepository;

  const mockUser = {
    id: '1',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
  };
  const mockAdvertisement = { id: '1', title: 'Software Engineer' };
  const mockJobApplication = {
    id: '1',
    user: mockUser,
    advertisements: mockAdvertisement,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobApplicationService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Advertisements),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(JobApplication),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JobApplicationService>(JobApplicationService);
    userRepository = module.get(getRepositoryToken(User));
    advertisementsRepository = module.get(getRepositoryToken(Advertisements));
    jobApplicationRepository = module.get(getRepositoryToken(JobApplication));
  });

  describe('create', () => {
    it('should create a job application successfully', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      advertisementsRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockAdvertisement);
      jobApplicationRepository.findOne = jest.fn().mockResolvedValue(null); // Simuler que l'utilisateur n'a pas encore postulé
      jobApplicationRepository.create = jest
        .fn()
        .mockReturnValue(mockJobApplication);
      jobApplicationRepository.save = jest
        .fn()
        .mockResolvedValue(mockJobApplication);

      const result = await service.create({ advertisementsId: '1' }, '1');
      expect(result).toEqual({
        message: 'You applied to the job successfully',
      });
    });

    it('should throw error if user not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.create({ advertisementsId: '1' }, '1'),
      ).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw error if advertisement not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      advertisementsRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.create({ advertisementsId: '1' }, '1'),
      ).rejects.toThrow(
        new HttpException('Advertisement not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw error if already applied', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      advertisementsRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockAdvertisement);
      jobApplicationRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockJobApplication);

      await expect(
        service.create({ advertisementsId: '1' }, '1'),
      ).rejects.toThrow(
        new HttpException(
          'You have already applied to this job',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
