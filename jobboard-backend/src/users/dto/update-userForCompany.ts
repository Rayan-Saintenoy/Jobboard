import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserForCompanyDto {
  @ApiProperty({
    example: 'John-Doe@mail.fr',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  userEmail: string;
}
