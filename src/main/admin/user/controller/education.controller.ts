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
  UpdateEducationDto,
  UpdateEducationItemDto,
} from '../dto/education.dto';
import { EducationService } from '../services/education.service';

@ApiTags('Admin -- Education')
@Controller('admin/education')
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
    return this.educationService.createEducations(dto, id);
  }

  @Get('get/single/:id')
  getSingle(@Param('id') id: string) {
    return this.educationService.getSingleEducation(id);
  }

  @Get('get/multiple/:userId')
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

  // @Patch('update/multiple/:userId')
  // updateEducations(
  //   @Body() dto: UpdateEducationDto,
  //   @Param('userId') id: string,
  // ) {
  //   return this.educationService.updateEducations(id, dto);
  // }
}
