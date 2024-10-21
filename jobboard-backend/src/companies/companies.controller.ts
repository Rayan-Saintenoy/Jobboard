import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { isAdminGuard } from '../auth/guard/isAdmin.guard';
import { isRecruiter } from '../auth/guard/isRecruiter.guard';
import { GetIdWithToken } from '../common/user.decorator';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(AuthGuard, isRecruiter)
  @ApiOperation({
    summary: 'Protected by "auth guard + is_recruiter guard"',
    description:
      "Crée une nouvelle entreprise si l'utilisateur a le rôle recruteur",
  })
  @Post('add')
  create(@GetIdWithToken() userId, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(userId, createCompanyDto);
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  @ApiOperation({
    summary: 'Protected by auth guard',
    description:
      "Récupère les informations d'une entreprise en fonction de l'id de l'utilisateur",
  })
  findCompanyByUserId(@GetIdWithToken() userId: string) {
    return this.companiesService.findCompanyByUserId(userId);
  }
  @UseGuards(AuthGuard, isRecruiter)
  @Put('/update')
  @ApiOperation({
    summary: 'Protected by "auth guard + is recruiter"',
    description:
      "Permet à l'utilisateur de modifier les informations de son entreprise sur son panel de recruteur",
  })
  async update(
    @GetIdWithToken() userId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.companiesService.findCompanyByUserId(userId);

    if (!company) {
      throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
    }

    return this.companiesService.updateCompany(company.id, updateCompanyDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Route not protected by guards',
    description:
      "Récupère les informations d'une entreprise en fonction de son id",
  })
  findOne(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @UseGuards(AuthGuard, isAdminGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Protected by "auth guard + is_admin guard"',
    description: 'Permet à un admin de supprimé une entreprise',
  })
  remove(@Param('companyId') companyId: string) {
    return this.companiesService.deleteCompany(companyId);
  }
}
