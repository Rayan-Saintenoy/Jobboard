import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserForCompanyDto } from './dto/update-userForCompany';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,

    @InjectRepository(Company)
    private readonly CompanyRepository: Repository<Company>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      this.logger.log(
        `Received CreateUserDto: ${JSON.stringify(createUserDto)}`,
      );

      const userExist = await this.UserRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (userExist) {
        throw new HttpException(
          'User with this email already exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // format the phone number to replace +33 by 0 and remove spaces
      createUserDto.phoneNumber = createUserDto.phoneNumber.replace(/\s/g, '');
      if (createUserDto.phoneNumber.startsWith('+33')) {
        createUserDto.phoneNumber = createUserDto.phoneNumber.replace(
          '+33',
          '0',
        );
      }

      const newUser = this.UserRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      await this.UserRepository.save(newUser);

      return {
        message: 'Account created successfully',
      };
    } catch (error) {
      this.logger.log('error : ', error);
      // throw error;
      throw new HttpException(
        error.message || 'An error occurred',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(userId: string) {
    try {
      this.logger.log('userId:', userId);
      const user = await this.UserRepository.findOne({
        where: { id: userId },
        select: {
          id: false,
          firstname: true,
          lastname: true,
          email: true,
          phoneNumber: true,
          password: false,
          is_admin: false,
          is_recruiter: false,
        },
      });

      if (!user) {
        throw new HttpException('User not fount', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      this.logger.log('error : ', error);
      throw error;
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.UserRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      Object.assign(user, updateUserDto);

      await this.UserRepository.save(user);

      return { message: 'User updated successfully' };
    } catch (error) {
      this.logger.log('error : ', error);
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.UserRepository.findOne({
        where: { email: email },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      this.logger.log('error: ' + error);
      throw error;
    }
  }

  async assignCompanyToUserWithUserIdWithTransaction(
    userId: string,
    companyId: string,
    entityManager: EntityManager,
  ) {
    try {
      const user = await this.UserRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const company = await this.CompanyRepository.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      user.company = company;
      user.is_recruiter = true;
      await this.UserRepository.save(user);

      if (!company.users) {
        company.users = [];
      }
      company.users.push(user);
      await entityManager.save(company);
    } catch (error) {
      this.logger.log('error : ', error);
      throw error;
    }
  }

  async addUserToCompanyWithUserId(userId: string, companyId: string) {
    try {
      await this.UserRepository.manager.transaction(async (entityManager) => {
        await this.assignCompanyToUserWithUserIdWithTransaction(
          userId,
          companyId,
          entityManager,
        );
      });

      return { message: 'User assigned successfully' };
    } catch (error) {
      this.logger.log('error : ', error);
      throw error;
    }
  }

  async assignCompanyToUserWithUserEmailWithTransaction(
    updateUserForCompanyDto: UpdateUserForCompanyDto,
    recruiterId: string,
    entityManager: EntityManager,
  ) {
    try {
      const user = await this.UserRepository.findOne({
        where: { email: updateUserForCompanyDto.userEmail },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const recruiter = await this.UserRepository.findOne({
        where: { id: recruiterId },
      });

      if (!recruiter) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const recruiterCompanies = await this.CompanyRepository.findOne({
        where: { users: { id: recruiterId } },
      });

      // this.logger.log('recruiterCompanies identifiant:', recruiterCompanies.id);

      const recruiterCompanyId = recruiterCompanies.id;

      const company = await this.CompanyRepository.findOne({
        where: { id: recruiterCompanyId },
        relations: ['users'],
      });

      if (!company) {
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log('recruiterCompanyId:', recruiterCompanyId);

      // this.logger.log('isRecruiterCompany:', isRecruiterCompany);

      user.company = company;
      await this.UserRepository.save(user);

      const userExistsInCompany = company.users.some((u) => u.id === user.id);
      if (!userExistsInCompany) {
        company.users.push(user); // Ajouter le nouvel utilisateur
      }

      await entityManager.save(company);
    } catch (error) {
      this.logger.log('error : ', error);
      throw error;
    }
  }

  async addUserToCompanyWithEmail(
    updateUserForCompanyDto: UpdateUserForCompanyDto,
    recruiterId: string,
  ) {
    try {
      await this.UserRepository.manager.transaction(async (entityManager) => {
        await this.assignCompanyToUserWithUserEmailWithTransaction(
          updateUserForCompanyDto,
          recruiterId,
          entityManager,
        );
      });

      return { message: 'User assigned successfully' };
    } catch (error) {
      this.logger.log('error : ', error);
      throw error;
    }
  }

  async setUsersAsRecruiters(userEmail: string) {
    try {
      const user = await this.UserRepository.findOne({
        where: { email: userEmail },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      user.is_recruiter = true;
      await this.UserRepository.save(user);

      return { message: 'User successfully set as recruiter' };
    } catch (error) {
      this.logger.log('error : ', error);
      throw error;
    }
  }
}
