import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateCompanyDto {
  @ApiProperty({
    example: 'Gecko',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example:
      'https://upload.wikimedia.org/wikipedia/fr/2/22/Mozillagecko-logo.gif',
    required: true,
  })
  @IsNotEmpty()
  @IsUrl()
  logo_url: string;

  @ApiProperty({
    example: 'San Francisco, Californie, États-Unis',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}
