import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { GetRecognitionService } from '../services/get-recognition.service';
import { GetRecognitionDto } from '../dto/recognition.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';

@ApiTags('Admin -- Recognition')
@Controller('admin/recognition')
@ValidateAdmin()
@ApiBearerAuth()
@Injectable()
export class GetRecognitionController {
  constructor(private readonly recognitionService: GetRecognitionService) {}

  @Get()
  async getRecognitions(@Query() dto: GetRecognitionDto) {
    return this.recognitionService.getRecognitions(dto);
  }
}
