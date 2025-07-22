import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { SurveyService } from '../services/survey.service';
import { CreateSurveyDto } from '../dto/survey.dto';

@ApiTags('Admin -- Survey')
@Controller('admin/survey')
@ValidateAdmin()
@ApiBearerAuth()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) { }

  @Post()
  async createSurvey(@GetUser('userId') userId: string, @Body() dto: CreateSurveyDto) {
    return this.surveyService.createSurvey(userId, dto);
   }

  @Post('from-template')
  async createSurveyFromTemplate() { }

  @Get()
  async getAllSurveys() { }

  @Get(':id')
  async getSurvey() { }

  @Patch(':id')
  async updateSurvey() { }

  @Delete(':id/delete')
  async deleteSurvey() { }
}
