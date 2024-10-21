import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { isRecruiter } from '../auth/guard/isRecruiter.guard';
import { GetIdWithToken } from '../common/user.decorator';
import { AdvertisementsService } from './advertisements.service';
import { CreateAdvertisementsDto } from './dto/create-advertisements.dto';
import { UpdateAdvertisementsDto } from './dto/update-advertisements.dto';

@ApiTags('Advertisements')
@Controller('advertisements')
export class AdvertisementsController {
  constructor(private readonly advertisementsService: AdvertisementsService) {}

  @UseGuards(AuthGuard, isRecruiter)
  @Post()
  @ApiOperation({
    summary: 'Protected by "auth guard + is_recruiter guard"',
    description: "Permet au recruteur de créer une nouvelle offre d'emploi",
  })
  create(
    @Body() createAdvertisementsDto: CreateAdvertisementsDto,
    @GetIdWithToken() userId: string,
  ) {
    return this.advertisementsService.create(createAdvertisementsDto, userId);
  }

  @Get('/count')
  @ApiOperation({
    summary: 'Route not protected by guards',
    description: "Permet de voir le nombre d'offres d'emploi disponibles",
  })
  async count() {
    return this.advertisementsService.getNumberOfAdvertisements();
  }

  @Get()
  @ApiOperation({
    summary: 'Route not protected by guards',
    description:
      "Permet de voir toutes les offres d'emploi disponibles par limite et page",
  })
  async findAllWithPagination(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.advertisementsService.findAllWithPagination(
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('company')
  @UseGuards(AuthGuard, isRecruiter)
  @ApiOperation({
    summary: 'Route protected by "auth guard + is_recruiter guard"',
    description:
      "Permet au recruteur de voir toutes les offres d'emploi de son entreprise",
  })
  findAllAdvertisementsForCompany(@GetIdWithToken() userId: string) {
    return this.advertisementsService.findAllAdvertisementsWithApplicationForCompany(
      userId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Route not protected by guards',
    description: "Permet de voir une offre d'emploi en detail grace à son ID",
  })
  findById(@Param('id') id: string) {
    return this.advertisementsService.findById(id);
  }

  @UseGuards(AuthGuard, isRecruiter)
  @Put(':id')
  @ApiOperation({
    summary: 'Protected by "auth guard + is_recruiter guard"',
    description: 'Permet au recruteur de mettre à jour une offre d emploi',
  })
  update(
    @Param('id') id: string,
    @Body() updateAdvertisementsDto: UpdateAdvertisementsDto,
  ) {
    return this.advertisementsService.update(id, updateAdvertisementsDto);
  }

  @UseGuards(AuthGuard, isRecruiter)
  @Delete(':id')
  @ApiOperation({
    summary: 'Protected by "auth guard + is_recruiter guard"',
    description: 'Permets au recruteur de supprimer une offre d emploi',
  })
  remove(@Param('id') advertisementId: string) {
    return this.advertisementsService.delete(advertisementId);
  }
}
