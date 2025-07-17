import { Injectable } from '@nestjs/common';
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

  async getSingleExperience(id: string): Promise<TResponse<any>> {
    const experience = await this.prisma.experience.findUnique({
      where: {
        id,
      },
    });
    return successResponse(experience, 'Experience found successfully');
  }

  async getExperiences(userId: string): Promise<TResponse<any>> {
    const experiences = await this.prisma.experience.findMany({
      where: {
        userId,
      },
    });
    return successResponse(experiences, 'Experiences found successfully');
  }

  async deleteExperience(id: string): Promise<TResponse<any>> {
    const experience = await this.prisma.experience.delete({
      where: {
        id,
      },
    });
    return successResponse(experience, 'Experience deleted successfully');
  }

  async deleteExperiences(userId: string): Promise<TResponse<any>> {
    const experiences = await this.prisma.experience.deleteMany({
      where: {
        userId,
      },
    });
    return successResponse(experiences, 'All experiences deleted successfully');
  }

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
