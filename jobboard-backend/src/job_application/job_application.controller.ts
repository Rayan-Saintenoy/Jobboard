import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { GetIdWithToken } from '../common/user.decorator';
import { CreateJobApplicationDto } from './dto/create-job_application.dto';
import { JobApplicationService } from './job_application.service';

@ApiTags('JobApplication')
@Controller('job_application')
export class JobApplicationController {
  private readonly logger = new Logger(JobApplicationController.name);

  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post()
  create(
    @Body() createJobApplicationDto: CreateJobApplicationDto,
    @GetIdWithToken() userId: string,
  ) {
    return this.jobApplicationService.create(createJobApplicationDto, userId);
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  @ApiOperation({
    summary: 'Protected by "auth guard"',
    description: "Permet à l'utilisateur de consulter ses job applications",
  })
  findAllJobApplicationByIdUser(@GetIdWithToken() userId: string) {
    this.logger.log(userId);
    return this.jobApplicationService.findAllJobApplicationByIdUser(userId);
  }

  // @UseGuards(AuthGuard, isRecruiter)
  // @Get(':advertisementsId')
  // @ApiOperation({
  //   summary: 'Protected by "auth guard + is_recruiter guard"',
  //   description:
  //     "Permet au recruteur de consulter tout les utilisateur qui on postuler à son offre d'emploi",
  // })
  // findAllApplicantsByIdAdvertissements(
  //   @Param('advertisementsId') advertisementsId: string,
  // ) {
  //   return this.jobApplicationService.findAllApplicantsByIdAdvertissements(
  //     advertisementsId,
  //   );
  // }
}
