import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import {
  ExperienceDto,
  ExperienceItemDto,
  UpdateExperienceItemDto,
} from '../dto/experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Error adding experience')
  async createExperiences(
    dto: ExperienceDto,
    userId: string,
  ): Promise<TResponse<any>> {
    const experiences = await this.prisma.experience.createMany({
      data: dto.experiences.map((exp) => ({
        ...exp,
        userId,
      })),
    });
    return successResponse(experiences, 'Experiences added successfully');
  }

  @HandleError('Error adding experience')
  async createSingleExperience(
    dto: ExperienceItemDto,
    userId: string,
  ): Promise<TResponse<any>> {
    const experience = await this.prisma.experience.create({
      data: {
        ...dto,
        userId,
      },
    });
    return successResponse(experience, 'Experience added successfully');
  }

  @HandleError('Error getting experience')
  async getSingleExperience(id: string): Promise<TResponse<any>> {
    const experience = await this.prisma.experience.findUnique({
      where: {
        id,
      },
    });
    return successResponse(experience, 'Experience found successfully');
  }

  @HandleError('Error getting experience')
  async getExperiences(userId: string): Promise<TResponse<any>> {
    const experiences = await this.prisma.experience.findMany({
      where: {
        userId,
      },
    });
    return successResponse(experiences, 'Experiences found successfully');
  }

  @HandleError('Error deleting experience')
  async deleteExperience(id: string): Promise<TResponse<any>> {
    const experience = await this.prisma.experience.delete({
      where: {
        id,
      },
    });
    return successResponse(experience, 'Experience deleted successfully');
  }

  @HandleError('Error deleting experience')
  async deleteExperiences(userId: string): Promise<TResponse<any>> {
    const experiences = await this.prisma.experience.deleteMany({
      where: {
        userId,
      },
    });
    return successResponse(experiences, 'All experiences deleted successfully');
  }

  @HandleError('Error updating experience')
  async updateExperience(
    id: string,
    dto: UpdateExperienceItemDto,
  ): Promise<TResponse<any>> {
    const experience = await this.prisma.experience.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
    return successResponse(experience, 'Experience updated successfully');
  }
}
