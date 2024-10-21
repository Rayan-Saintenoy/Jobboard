import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninAuthDto {
  @ApiProperty({ example: 'mail.mail@mail.fr', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '*********', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
