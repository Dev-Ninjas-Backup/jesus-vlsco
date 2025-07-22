import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { AssignTeamsToASurveyDto, AssignUsersToASurveyDto, RemoveTeamsFromASurveyDto, RemoveUsersFromASurveyDto } from '../dto/survey-assign.dto';
import { SurveyAssignService } from '../services/survey-assign.service';

@ApiTags('Admin -- Survey Assign')
@Controller('admin/survey-assign')
@ValidateAdmin()
@ApiBearerAuth()
export class SurveyAssignController {
  constructor(private readonly surveyAssignService: SurveyAssignService) { }

  @Patch('assign-users/:surveyId')
  async assignUsersToASurvey(
    @Param('surveyId') surveyId: string,
    @Body() assignUsersToASurveyDto: AssignUsersToASurveyDto,
  ) {
    return this.surveyAssignService.assignUsersToASurvey(
      assignUsersToASurveyDto.userIds,
      surveyId,
    );
  }

  @Patch('remove-users/:surveyId')
  async removeUsersFromASurvey(
    @Param('surveyId') surveyId: string,
    @Body() removeUsersFromASurveyDto: RemoveUsersFromASurveyDto,
  ) {
    return this.surveyAssignService.removeUsersFromASurvey(
      removeUsersFromASurveyDto.userIds,
      surveyId,
    );
  }

  @Patch('assign-teams/:surveyId')
  async assignTeamToASurvey(
    @Param('surveyId') surveyId: string,
    @Body() assignTeamToASurveyDto: AssignTeamsToASurveyDto,
  ) {
    return this.surveyAssignService.assignTeamToASurvey(
      assignTeamToASurveyDto.teamIds,
      surveyId,
    );
  }

  @Patch('remove-teams/:surveyId')
  async removeTeamFromASurvey(
    @Param('surveyId') surveyId: string,
    @Body() removeTeamFromASurveyDto: RemoveTeamsFromASurveyDto,
  ) {
    return this.surveyAssignService.removeTeamFromASurvey(
      removeTeamFromASurveyDto.teamIds,
      surveyId,
    );
  }
}
