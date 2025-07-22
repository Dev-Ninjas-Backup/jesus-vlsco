import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import {
  CreateSurveyTemplateDto,
  GetAllSurveyTemplateDto,
} from '../dto/survey-template.dto';
import { SurveyTemplateService } from '../services/survey-template.service';

@ApiTags('Admin -- Survey Template')
@Controller('admin/survey-template')
@ValidateAdmin()
@ApiBearerAuth()
export class SurveyTemplateController {
  constructor(private readonly surveyTemplateService: SurveyTemplateService) {}

  @Post()
  async createSurveyTemplate(@Body() dto: CreateSurveyTemplateDto) {
    return this.surveyTemplateService.createSurveyTemplate(dto);
  }

  @Get()
  async getAllSurveyTemplate(@Query() query: GetAllSurveyTemplateDto) {
    return this.surveyTemplateService.getAllSurveyTemplate(query);
  }
}
