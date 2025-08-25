import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { AddRecognitionDto } from '../dto/add-recognition.dto';
import { addRecognitionSwaggerScham } from '../dto/add-recognition.swagger';
import { AddRecognitionService } from '../services/add-recognition.service';

@ApiTags('Admin -- Recognition')
@Controller('admin/recognition')
@ValidateAdmin()
@ApiBearerAuth()
export class AddRecognitionController {
  constructor(private readonly addRecognitionService: AddRecognitionService) {}

  @Post('/add-recognition')
  @ApiBody({
    description: 'Recognition Creation',
    schema: {
      type: 'object',
      properties: { ...addRecognitionSwaggerScham.properties },
    },
  })
  async addRecognition(
    @Body() dto: AddRecognitionDto,
    @GetUser('userId') adminId: string,
  ) {
    return await this.addRecognitionService.addRecognition(dto, adminId);
  }
}
