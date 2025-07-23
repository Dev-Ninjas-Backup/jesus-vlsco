import { Controller } from '@nestjs/common';
import { SurveyService } from '../services/survey.service';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}
}
