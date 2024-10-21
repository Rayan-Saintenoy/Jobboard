import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { SigninAuthDto } from './dto/signin-auth.dto';

const mockUser = {
  id: 1,
  email: 'mail.mail@mail.fr',
  password: 'hashed_password',
  is_recruiter: false,
  is_admin: false,
};

interface UserRepositoryMock {
  findOne: jest.Mock;
}

const mockUserRepository: UserRepositoryMock = {
  findOne: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepositoryMock>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should sign in successfully', async () => {
    const signinDto: SigninAuthDto = {
      email: mockUser.email,
      password: 'password',
    };

    userRepository.findOne.mockResolvedValue(mockUser);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(async (password: string, hash: string) => {
        console.log(`Comparing password: ${password} with hash: ${hash}`);
        return true;
      });
    mockJwtService.signAsync.mockResolvedValue('access_token');

    const result = await authService.signin(signinDto);

    expect(result).toEqual({
      access_token: 'access_token',
      is_recruiter: false,
      is_admin: false,
    });
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: signinDto.email },
    });
  });

  it('should throw an error if user does not exist', async () => {
    const signinDto: SigninAuthDto = {
      email: 'unknown@mail.fr',
      password: 'password',
    };

    userRepository.findOne.mockResolvedValue(null);

    await expect(authService.signin(signinDto)).rejects.toThrow(
      new HttpException(
        'User with this email doesn&apos;t exist',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should throw an error if password is incorrect', async () => {
    const signinDto: SigninAuthDto = {
      email: mockUser.email,
      password: 'wrong_password',
    };

    userRepository.findOne.mockResolvedValue(mockUser);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(async (_password: string, _hash: string) => {
        console.log(`Comparing password: ${_password} with hash: ${_hash}`);
        return false;
      });

    await expect(authService.signin(signinDto)).rejects.toThrow(
      new HttpException(
        'Password for this user are not the same.',
        HttpStatus.BAD_REQUEST,
      ),
    );
  });
});
