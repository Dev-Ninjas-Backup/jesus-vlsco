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
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { SurveyResponseService } from '@project/main/user/survey/services/survey-response.service';
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
    private readonly surveyResponseService: SurveyResponseService,
    private readonly getSurveyResponseService: GetSurveyResponseService,
  ) {}

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

  @Get('response/all')
  async getAllResponses(@Query() query: PaginationDto) {
    return this.getSurveyResponseService.getAllResponses(query);
  }

  @Get('response/:userId/all')
  async getAllResponsesByAEmployee(
    @Param('userId') userId: string,
    @Query() query: PaginationDto,
  ) {
    return this.surveyResponseService.getAllResponsesByAEmployee(userId, query);
  }

  @Get('response/:id')
  async getSingleResponse(@Param('id') id: string) {
    return this.getSurveyResponseService.getSingleResponse(id);
  }
}
