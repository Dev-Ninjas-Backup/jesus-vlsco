import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import {
  EducationItemDto,
  UpdateEducationDto,
  UpdateEducationItemDto,
} from '../dto/education.dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Error creating educations')
  async createEducations(
    dto: EducationItemDto[],
    userid: string,
  ): Promise<TResponse<any>> {
    const educations = await this.prisma.education.createMany({
      data: dto.map((education) => ({
        ...education,
        userId: userid,
      })),
    });
    return successResponse(educations, 'Educations added successfully');
  }

  @HandleError('Error creating education')
  async createSingleEducation(
    dto: EducationItemDto,
    userid: string,
  ): Promise<TResponse<any>> {
    const education = await this.prisma.education.create({
      data: {
        ...dto,
        userId: userid,
      },
    });
    return successResponse(education, 'Education added successfully');
  }

  @HandleError('Error getting education')
  async getSingleEducation(id: string): Promise<TResponse<any>> {
    const education = await this.prisma.education.findUnique({
      where: {
        id: id,
      },
    });
    return successResponse(education, 'Education found successfully');
  }

  @HandleError('Error getting educations')
  async getEducations(userId: string): Promise<TResponse<any>> {
    const educations = await this.prisma.education.findMany({
      where: {
        userId: userId,
      },
    });
    return successResponse(educations, 'Educations found successfully');
  }

  @HandleError('Error deleting education')
  async deleteEducation(id: string): Promise<TResponse<any>> {
    const education = await this.prisma.education.delete({
      where: {
        id: id,
      },
    });
    return successResponse(education, 'Education deleted successfully');
  }

  @HandleError('Error deleting educations')
  async deleteEducations(userId: string): Promise<TResponse<any>> {
    const educations = await this.prisma.education.deleteMany({
      where: {
        userId: userId,
      },
    });
    return successResponse(educations, 'Educations deleted successfully');
  }

  @HandleError('Error updating education')
  async updateEducation(
    id: string,
    dto: UpdateEducationItemDto,
  ): Promise<TResponse<any>> {
    const education = await this.prisma.education.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });
    return successResponse(education, 'Education updated successfully');
  }

  @HandleError('Error updating educations')
  async updateEducations(
    userId: string,
    dto: UpdateEducationDto,
  ): Promise<TResponse<any>> {
    const updated = [];

    for (const item of dto.educations) {
      const edu = await this.prisma.education.updateMany({
        where: { userId },
        data: {
          program: item.program,
          institution: item.institution,
          year: item.year,
        },
      });
      updated.push(edu);
    }

    return successResponse(updated, 'Educations updated successfully');
  }
}
