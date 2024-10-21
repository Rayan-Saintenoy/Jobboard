import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { isAdminGuard } from '../auth/guard/isAdmin.guard';
import { isRecruiter } from '../auth/guard/isRecruiter.guard';
import { GetIdWithToken } from '../common/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserForCompanyDto } from './dto/update-userForCompany';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  @ApiOperation({
    summary: 'Protected by "auth guard"',
    description: "Permet à l'utilisateur de recupérer ses informations",
  })
  findById(@GetIdWithToken() userId: string) {
    return this.usersService.findById(userId);
  }

  @Post('add')
  @ApiOperation({
    summary: 'Route not protected by guards',
    description: "Inscription d'un utilisateur",
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Put('/me/update')
  @ApiOperation({
    summary: 'Protected by "auth guard"',
    description:
      "Permet à l'utilisateur de modifier les informations sur son profile",
  })
  update(
    @GetIdWithToken() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @UseGuards(AuthGuard, isRecruiter)
  @Patch('add/company/user')
  @ApiOperation({
    summary: 'Protected by "auth guard + is_recruiter',
    description:
      "Permet au recruteur d'ajouter un utilisateur à son entreprise",
  })
  async addUserToCompanyWithEmail(
    @Body() updateUserForCompanyDto: UpdateUserForCompanyDto, // email de l'utilisateur à ajouter
    @GetIdWithToken() recruiterId: string, // id de l'utilisateur connecté (le recruteur qui ajoute l'utilisateur)
  ) {
    return this.usersService.addUserToCompanyWithEmail(
      updateUserForCompanyDto,
      // companyId,
      recruiterId,
    );
  }

  @UseGuards(AuthGuard, isAdminGuard)
  @ApiOperation({
    summary: 'Protected by "auth guard + is_admin" | !!! only admin !!!',
    description: 'set user as a recruiter',
  })
  @Patch(':email/recruiter')
  async setUsersAsRecruiters(@Param('email') email: string) {
    return this.usersService.setUsersAsRecruiters(email);
  }
}
