import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreateSurveyFromTemplateDto } from '../dto/create-survey-from-template.dto';
import { GetAllSurveysDto } from '../dto/get-survey.dto';
import { CreateSurveyDto, UpdateSurveyDto } from '../dto/survey.dto';
import { GetSurveyResponseService } from '../services/get-survey-response.service';
import { SurveyService } from '../services/survey.service';

@ApiTags('Admin -- Survey')
@Controller('admin/survey')
@ValidateAdmin()
@ApiBearerAuth()
export class SurveyController {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly getSurveyResponseService: GetSurveyResponseService,
  ) { }

  @Post()
  async createSurvey(
    @GetUser('userId') userId: string,
    @Body() dto: CreateSurveyDto,
  ) {
    return this.surveyService.createSurvey(userId, dto);
  }

  @Post('from-template/:templateId')
  async createSurveyFromTemplate(
    @GetUser('userId') userId: string,
    @Param('templateId') templateId: string,
    @Body() dto: CreateSurveyFromTemplateDto,
  ) {
    return this.surveyService.createSurveyFromTemplate(userId, templateId, dto);
  }

  @Get('get-all')
  async getAllSurveys(@Query() dto: GetAllSurveysDto) {
    return this.surveyService.getAllSurveys(dto);
  }

  @Get(':id')
  async getSurvey(@Param('id') id: string) {
    return this.surveyService.getSurvey(id);
  }

  @Patch(':id')
  async updateSurvey(@Param('id') id: string, @Body() dto: UpdateSurveyDto) {
    return this.surveyService.updateSurvey(id, dto);
  }

  @Delete(':id/delete')
  async deleteSurvey(@Param('id') id: string) {
    return this.surveyService.deleteSurvey(id);
  }
}
