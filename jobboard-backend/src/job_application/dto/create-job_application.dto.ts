import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateJobApplicationDto {
  @ApiProperty({
    example: 'Advertisements ID',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  advertisementsId: string;
}
