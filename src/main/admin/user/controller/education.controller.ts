import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { EducationDto, EducationItemDto } from '../dto/education.dto';
import { EducationService } from '../services/education.service';

@ApiTags('Admin -- Education')
@Controller('admin/education')
@ValidateAdmin()
@ApiBearerAuth()
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post('single-education/:userId')
  create(@Body() dto: EducationItemDto, @Param('userId') id: string) {
    return this.educationService.createSingleEducation(dto, id);
  }

  @Post('multiple-education/:userId')
  createEducations(@Body() dto: EducationDto, @Param('userId') id: string) {
    return this.educationService.createEducations(dto, id);
  }
}
