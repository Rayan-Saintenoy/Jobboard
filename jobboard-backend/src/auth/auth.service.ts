import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SigninAuthDto } from './dto/signin-auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,

    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  async signin(signinAuthDto: SigninAuthDto) {
    const user = await this.UserRepository.findOne({
      where: { email: signinAuthDto.email },
    });

    if (!user) {
      throw new HttpException(
        'User with this email doesn&apos;t exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const verifyPassword = await bcrypt.compare(
      signinAuthDto.password,
      user.password,
    );

    if (!verifyPassword) {
      throw new HttpException(
        'Password for this user are not the same.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = {
      id_user: user.id,
      is_recruiter: user.is_recruiter,
      is_admin: user.is_admin,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token: access_token,
      is_recruiter: user.is_recruiter,
      is_admin: user.is_admin,
    };
  }
}
