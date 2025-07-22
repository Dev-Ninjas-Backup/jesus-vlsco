import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import {
  CreateSurveyTemplateDto,
  GetAllSurveyTemplateDto,
  UpdateSurveyTemplateDto,
} from '../dto/survey-template.dto';
import { SurveyTemplateService } from '../services/survey-template.service';

@ApiTags('Admin -- Survey Template')
@Controller('admin/survey-template')
@ValidateAdmin()
@ApiBearerAuth()
export class SurveyTemplateController {
  constructor(private readonly surveyTemplateService: SurveyTemplateService) { }

  @Post()
  async createSurveyTemplate(@Body() dto: CreateSurveyTemplateDto) {
    return this.surveyTemplateService.createSurveyTemplate(dto);
  }

  @Get()
  async getAllSurveyTemplate(@Query() query: GetAllSurveyTemplateDto) {
    return this.surveyTemplateService.getAllSurveyTemplate(query);
  }

  @Get(':id')
  async getSurveyTemplate(@Param('id') id: string) {
    return this.surveyTemplateService.getSurveyTemplate(id);
  }

  @Patch(':id')
  async updateSurveyTemplate(@Param('id') id: string, dto: UpdateSurveyTemplateDto) {
    return this.surveyTemplateService.updateSurveyTemplate(id, dto);
  }

  @Delete(':id')
  async deleteSurveyTemplate(@Param('id') id: string) {
    return this.surveyTemplateService.deleteSurveyTemplate(id);
  }
}
