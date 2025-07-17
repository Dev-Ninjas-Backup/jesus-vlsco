import { Injectable } from '@nestjs/common';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { EducationDto, EducationItemDto } from '../dto/education.dto';

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
}
