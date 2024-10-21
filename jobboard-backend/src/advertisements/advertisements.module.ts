import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'src/companies/companies.module';
import { JobApplication } from 'src/job_application/entities/job_application.entity';
import { JobApplicationModule } from 'src/job_application/job_application.module';
import { User } from 'src/users/entities/user.entity';
import { AdvertisementsController } from './advertisements.controller';
import { AdvertisementsService } from './advertisements.service';
import { Advertisements } from './entities/advertisement.entity';

@Module({
  imports: [
    forwardRef(() => CompaniesModule),
    forwardRef(() => JobApplicationModule),
    TypeOrmModule.forFeature([User, Advertisements, JobApplication]),
  ],
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService],
})
export class AdvertisementsModule {}
