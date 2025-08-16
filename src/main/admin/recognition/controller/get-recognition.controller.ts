import { Controller, Get, Injectable, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { GetRecognitionDto } from '../dto/recognition.dto';
import { GetRecognitionService } from '../services/get-recognition.service';

@ApiTags('Admin -- Recognition')
@Controller('admin/recognition')
@ValidateAdmin()
@ApiBearerAuth()
@Injectable()
export class GetRecognitionController {
  constructor(private readonly recognitionService: GetRecognitionService) {}

  @Get()
  async getRecognitions(
    @Query() dto: GetRecognitionDto,
    @GetUser('userId') userId: string,
  ) {
    return this.recognitionService.getRecognitions(dto, userId);
  }

  @Get(':recognitionId/single-recognition')
  async getSingleRecognition(@Param('recognitionId') id: string) {
    return this.recognitionService.getSingleRecognition(id);
  }
}
