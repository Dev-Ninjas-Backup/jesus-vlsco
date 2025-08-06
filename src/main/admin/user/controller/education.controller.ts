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
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import {
  EducationDto,
  EducationItemDto,
  UpdateEducationItemDto,
} from '../dto/education.dto';
import { EducationService } from '../services/education.service';

@ApiTags('Admin -- Education')
@Controller('admin/user/education')
@ValidateAdmin()
@ApiBearerAuth()
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post('create/single/:userId')
  create(@Body() dto: EducationItemDto, @Param('userId') id: string) {
    return this.educationService.createSingleEducation(dto, id);
  }

  @Post('create/multiple/:userId')
  createEducations(@Body() dto: EducationDto, @Param('userId') id: string) {
    return this.educationService.createEducations(dto.educations, id);
  }

  @Get('get/single/:id')
  getSingle(@Param('id') id: string) {
    return this.educationService.getSingleEducation(id);
  }

  @Get('get/user/:userId')
  getEducations(@Param('userId') id: string) {
    return this.educationService.getEducations(id);
  }

  @Delete('delete/single/:id')
  delete(@Param('id') id: string) {
    return this.educationService.deleteEducation(id);
  }

  @Delete('delete/multiple/:userId')
  deleteEducations(@Param('userId') id: string) {
    return this.educationService.deleteEducations(id);
  }

  @Patch('update/single/:id')
  update(@Body() dto: UpdateEducationItemDto, @Param('id') id: string) {
    return this.educationService.updateEducation(id, dto);
  }
}
