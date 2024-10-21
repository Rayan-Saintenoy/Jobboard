import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Advertisements } from '../advertisements/entities/advertisement.entity';
import { JobApplication } from '../job_application/entities/job_application.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    @InjectRepository(Company)
    private readonly CompanyRepository: Repository<Company>,

    @InjectRepository(Advertisements)
    private readonly AdvertisementsRepository: Repository<Advertisements>,

    private readonly userServices: UsersService,
  ) {}

  async create(userId, createCompanyDto: CreateCompanyDto) {
    this.logger.log(
      `Received userReq: ${userId}, CreateUserDto: ${JSON.stringify(createCompanyDto)}`,
    );

    try {
      const companyExist = await this.CompanyRepository.findOne({
        where: { name: createCompanyDto.name },
      });
      if (companyExist) {
        throw new HttpException(
          'Company with this name already exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const recruiterCompanies = await this.CompanyRepository.find({
        where: { users: { id: userId } },
      });

      if (recruiterCompanies.length > 0) {
        throw new HttpException(
          'User already have a company',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newCompany = this.CompanyRepository.create({
        ...createCompanyDto,
      });

      const company = await this.CompanyRepository.save(newCompany);

      await this.userServices.addUserToCompanyWithUserId(userId, company.id);

      return {
        message: 'Company created successfully and user added to the company',
      };
    } catch (error) {
      this.logger.log('error : ' + error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const company = await this.CompanyRepository.findOne({
        where: { id: id },
      });

      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      return company;
    } catch (error) {
      this.logger.log('error : ' + error);
      throw error;
    }
  }

  async findCompanyByUserId(userId: string): Promise<Company | null> {
    const company = await this.CompanyRepository.findOne({
      where: { users: { id: userId } },
    });

    return company || null;
  }

  async updateCompany(companyId: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const company = await this.CompanyRepository.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(updateCompanyDto);
      Object.assign(company, updateCompanyDto);

      await this.CompanyRepository.save(company);

      return { message: 'Company updated successfully' };
    } catch (error) {
      this.logger.log('error : ', error);
      throw error;
    }
  }

  async deleteCompany(companyId: string) {
    try {
      const company = await this.CompanyRepository.findOne({
        where: { id: companyId },
        relations: ['advertisements', 'users'],
      });

      // this.logger.log('company : ' + JSON.stringify(company));

      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      await this.CompanyRepository.manager.transaction(
        async (EntityManager: EntityManager) => {
          if (company.advertisements && company.advertisements.length > 0) {
            for (const advertisement of company.advertisements) {
              // Supprimer d'abord les JobApplications liées à cet Advertisement
              await EntityManager.delete(JobApplication, {
                advertisements: advertisement,
              });
            }

            await EntityManager.delete(Advertisements, {
              company: company,
            });
          }

          if (company.users && company.users.length > 0) {
            for (const user of company.users) {
              await EntityManager.update(User, user.id, { company: null });
            }
          }

          await EntityManager.remove(Company, company);
        },
      );

      return { message: 'Company removed successfully' };
    } catch (error) {
      this.logger.log('error : ' + error);
      throw error;
    }
  }
}
