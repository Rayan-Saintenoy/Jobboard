import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advertisements } from 'src/advertisements/entities/advertisement.entity';
import { User } from 'src/users/entities/user.entity';
import { JobApplication } from './entities/job_application.entity';
import { JobApplicationController } from './job_application.controller';
import { JobApplicationService } from './job_application.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Advertisements, JobApplication])],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
  exports: [JobApplicationService],
})
export class JobApplicationModule {}
