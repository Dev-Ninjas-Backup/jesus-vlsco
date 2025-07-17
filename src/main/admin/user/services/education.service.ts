import { Injectable } from '@nestjs/common';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import {
  EducationDto,
  EducationItemDto,
  UpdateEducationDto,
  UpdateEducationItemDto,
} from '../dto/education.dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async createEducations(
    dto: EducationDto,
    userid: string,
  ): Promise<TResponse<any>> {
    const educations = await this.prisma.education.createMany({
      data: dto.educations.map((education) => ({
        ...education,
        userId: userid,
      })),
    });
    return successResponse(educations, 'Educations added successfully');
  }

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

  async getSingleEducation(id: string): Promise<TResponse<any>> {
    const education = await this.prisma.education.findUnique({
      where: {
        id: id,
      },
    });
    return successResponse(education, 'Education found successfully');
  }

  async getEducations(userId: string): Promise<TResponse<any>> {
    const educations = await this.prisma.education.findMany({
      where: {
        userId: userId,
      },
    });
    return successResponse(educations, 'Educations found successfully');
  }

  async deleteEducation(id: string): Promise<TResponse<any>> {
    const education = await this.prisma.education.delete({
      where: {
        id: id,
      },
    });
    return successResponse(education, 'Education deleted successfully');
  }

  async deleteEducations(userId: string): Promise<TResponse<any>> {
    const educations = await this.prisma.education.deleteMany({
      where: {
        userId: userId,
      },
    });
    return successResponse(educations, 'Educations deleted successfully');
  }

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
