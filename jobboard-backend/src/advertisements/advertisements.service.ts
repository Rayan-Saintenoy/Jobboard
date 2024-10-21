import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { JobApplication } from '../job_application/entities/job_application.entity';
import { User } from '../users/entities/user.entity';
import { CreateAdvertisementsDto } from './dto/create-advertisements.dto';
import { UpdateAdvertisementsDto } from './dto/update-advertisements.dto';
import { Advertisements } from './entities/advertisement.entity';

@Injectable()
export class AdvertisementsService {
  private readonly logger = new Logger(AdvertisementsService.name);

  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,

    @InjectRepository(Advertisements)
    private readonly AdvertisementsRepository: Repository<Advertisements>,
  ) {}

  async create(
    createAdvertisementsDto: CreateAdvertisementsDto,
    userId: string,
  ) {
    try {
      this.logger.log(
        `Received createAdvertisementsDto: ${JSON.stringify(createAdvertisementsDto)}`,
      );
      const user = await this.UserRepository.findOne({
        where: { id: userId },
        relations: ['company'],
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const company = user.company;

      if (!company) {
        throw new HttpException(
          'Company not found for the user',
          HttpStatus.NOT_FOUND,
        );
      }

      // reduit le nombre de caractère de la description pour avoir la short_description
      const short_description =
        createAdvertisementsDto.description.slice(0, 250) + '...';

      const newAdvertisements = this.AdvertisementsRepository.create({
        ...createAdvertisementsDto,
        short_description,
        company,
      });

      await this.AdvertisementsRepository.save(newAdvertisements);

      return { message: 'Advertisement created successfully' };
    } catch (error) {
      this.logger.log('error : ', error);
      throw error;
    }
  }

  async getNumberOfAdvertisements() {
    try {
      const count = await this.AdvertisementsRepository.count();
      return count;
    } catch (error) {
      this.logger.error('Error while fetching advertisements: ', error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const advertisement = await this.AdvertisementsRepository.findOne({
        where: { id: id },
        select: {
          id: true,
          title: true,
          post_date: true,
          short_description: false,
          description: true,
          salary: true,
          place: true,
          working_time: true,
          skills: true,
          company: {
            id: true,
            name: true,
          },
        },
        relations: ['company'],
      });

      if (!advertisement) {
        throw new HttpException(
          'Advertisement not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return advertisement;
    } catch (error) {
      this.logger.error('Error while fetching advertisement: ', error);
      throw error;
    }
  }

  async findAllAdvertisementsWithApplicationForCompany(userId: string) {
    try {
      // this.logger.log(`Received userId: ${userId}`);

      const user = await this.UserRepository.findOne({
        where: { id: userId },
        relations: ['company'],
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const company = user.company;

      if (!company) {
        throw new HttpException(
          'User is not associated with any company',
          HttpStatus.NOT_FOUND,
        );
      }

      // this.logger.log(`Company id: ${JSON.stringify(company.id)}`);

      const advertisements = await this.AdvertisementsRepository.find({
        where: { company: { id: company.id } },
        relations: ['jobApplications', 'jobApplications.user'],
        order: { post_date: 'DESC' },
        select: {
          id: true,
          title: true,
          post_date: true,
          short_description: false,
          description: true,
          salary: true,
          place: true,
          working_time: true,
          skills: true,
          jobApplications: {
            id: true,
            user: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });

      if (!advertisements || advertisements.length === 0) {
        throw new HttpException(
          'No advertisements found for this company',
          HttpStatus.NOT_FOUND,
        );
      }

      return advertisements;
    } catch (error) {
      this.logger.error('Error while fetching company advertisements: ');
      throw error;
    }
  }

  async findAllWithPagination(page: number, limit: number) {
    try {
      const [advertisements] = await this.AdvertisementsRepository.findAndCount(
        {
          relations: ['company'],
          select: {
            id: true,
            title: true,
            short_description: true,
            description: false,
            place: false,
            salary: false,
            post_date: true,
            skills: false,
            working_time: false,
            company: {
              id: true,
              name: true,
              logo_url: false,
            },
          },
          skip: (page - 1) * limit,
          take: limit,
          order: { post_date: 'DESC' },
        },
      );

      if (!advertisements) {
        throw new HttpException(
          'Advertisements not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return advertisements;
    } catch (error) {
      this.logger.error('Error while fetching advertisements: ', error);
      throw error;
    }
  }

  async update(id: string, updateAdvertisementsDto: UpdateAdvertisementsDto) {
    try {
      const advertisement = await this.AdvertisementsRepository.findOne({
        where: { id: id },
      });

      if (!advertisement) {
        throw new HttpException(
          'Advertisement not found',
          HttpStatus.NOT_FOUND,
        );
      }

      Object.assign(advertisement, updateAdvertisementsDto);

      await this.AdvertisementsRepository.save(advertisement);

      return { message: 'Advertisement updated successfully' };
    } catch (error) {
      this.logger.log('error : ' + error);
      throw error;
    }
  }

  async delete(advertisementId: string) {
    try {
      this.logger.log(`Received id: ${advertisementId}`);

      const advertisement = await this.AdvertisementsRepository.findOne({
        where: { id: advertisementId },
        relations: ['jobApplications'],
      });

      if (!advertisement) {
        throw new HttpException(
          'Advertisement not found',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.AdvertisementsRepository.manager.transaction(
        async (EntityManager: EntityManager) => {
          if (
            advertisement.jobApplications &&
            advertisement.jobApplications.length > 0
          ) {
            await EntityManager.delete(JobApplication, {
              advertisements: advertisement,
            });
          }

          await EntityManager.remove(Advertisements, advertisement);
        },
      );

      return { message: 'Advertisement deleted successfully' };
    } catch (error) {
      this.logger.log('error : ' + error);
      throw error;
    }
  }
}
