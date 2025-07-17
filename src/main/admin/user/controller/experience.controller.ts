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
import { ExperienceDto, ExperienceItemDto } from '../dto/experience.dto';
import { ExperienceService } from '../services/experience.service';

@ApiTags('Admin -- Experience')
@Controller('admin/user/experience')
@ValidateAdmin()
@ApiBearerAuth()
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post('create/single/:userId')
  async createSingleExperience(
    @Body() dto: ExperienceItemDto,
    @Param('userId') userId: string,
  ) {
    return this.experienceService.createSingleExperience(dto, userId);
  }

  @Post('create/multiple/:userId')
  async createExperiences(
    @Body() dto: ExperienceDto,
    @Param('userId') userId: string,
  ) {
    return this.experienceService.createExperiences(dto, userId);
  }

  @Get('get/single/:userId')
  async getSingleExperience(id: string) {
    return this.experienceService.getSingleExperience(id);
  }

  @Get('get/user/:userId')
  async getExperiences(userId: string) {
    return this.experienceService.getExperiences(userId);
  }

  @Delete('delete/single/:id')
  async deleteExperience(id: string) {
    return this.experienceService.deleteExperience(id);
  }

  @Delete('delete/multiple/:userId')
  async deleteExperiences(userId: string) {
    return this.experienceService.deleteExperiences(userId);
  }

  @Patch('update/single/:id')
  async updateExperience(id: string, dto: any) {
    return this.experienceService.updateExperience(id, dto);
  }
}
