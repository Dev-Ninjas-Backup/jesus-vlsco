import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreateSurveyFromTemplateDto } from '../dto/create-survey-from-template.dto';
import { CreateSurveyDto } from '../dto/survey.dto';
import { SurveyService } from '../services/survey.service';

@ApiTags('Admin -- Survey')
@Controller('admin/survey')
@ValidateAdmin()
@ApiBearerAuth()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) { }

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

  @Get()
  async getAllSurveys() { }

  @Get(':id')
  async getSurvey() { }

  @Patch(':id')
  async updateSurvey() { }

  @Delete(':id/delete')
  async deleteSurvey() { }
}
