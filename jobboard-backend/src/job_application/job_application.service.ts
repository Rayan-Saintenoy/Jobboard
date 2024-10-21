import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advertisements } from '../advertisements/entities/advertisement.entity';
import { User } from '../users/entities/user.entity';
import { CreateJobApplicationDto } from './dto/create-job_application.dto';
import { JobApplication } from './entities/job_application.entity';

@Injectable()
export class JobApplicationService {
  private readonly logger = new Logger(JobApplicationService.name);

  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,

    @InjectRepository(Advertisements)
    private readonly AdvertisementsRepository: Repository<Advertisements>,

    @InjectRepository(JobApplication)
    private readonly JobApplicationRepository: Repository<JobApplication>,
  ) {}

  async create(
    createJobApplicationDto: CreateJobApplicationDto,
    userId: string,
  ) {
    try {
      const user = await this.UserRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const advertisement = await this.AdvertisementsRepository.findOne({
        where: { id: createJobApplicationDto.advertisementsId },
      });

      if (!advertisement) {
        throw new HttpException(
          'Advertisement not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const alreadyApplied = await this.JobApplicationRepository.findOne({
        where: {
          user: { id: userId },
          advertisements: { id: createJobApplicationDto.advertisementsId },
        },
      });

      if (alreadyApplied) {
        throw new HttpException(
          'You have already applied to this job',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newJobApplication = this.JobApplicationRepository.create({
        ...createJobApplicationDto,
        user,
        advertisements: advertisement,
      });

      await this.JobApplicationRepository.save(newJobApplication);

      return { message: 'You applied to the job successfully' };
    } catch (error) {
      this.logger.error('Error creating job application: ', error);
      throw error;
    }
  }

  async findAllJobApplicationByIdUser(userId: string) {
    try {
      const jobApplications = await this.JobApplicationRepository.find({
        where: { user: { id: userId } },
        select: {
          advertisements: {
            id: true,
            title: true,
            post_date: true,
            short_description: false,
            description: true,
            salary: true,
            place: true,
            working_time: true,
            skills: true,
          },
        },
        relations: ['advertisements'],
      });

      return jobApplications;
    } catch (error) {
      this.logger.error('Error retrieving job applications: ', error);
      throw error;
    }
  }

  // async findAllApplicantsByIdAdvertissements(advertisementId: string) {
  //   try {
  //     const users = await this.JobApplicationRepository.find({
  //       where: {
  //         advertisements: { id: advertisementId },
  //       },
  //       relations: ['user'],
  //       select: {
  //         id: true,
  //         user: {
  //           id: true,
  //           firstname: true,
  //           lastname: true,
  //           email: true,
  //           phoneNumber: true,
  //           password: false,
  //         },
  //       },
  //     });

  //     if (users.length === 0) {
  //       throw new HttpException('No users found', HttpStatus.NOT_FOUND);
  //     }

  //     return users;
  //   } catch (error) {
  //     this.logger.error('Error retrieving users for advertisement: ', error);
  //     throw error;
  //   }
  // }
}
