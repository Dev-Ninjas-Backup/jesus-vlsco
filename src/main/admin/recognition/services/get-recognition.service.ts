import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetRecognitionDto } from '../dto/recognition.dto';

@Injectable()
export class GetRecognitionService {
  constructor(private readonly prisma: PrismaService) { }

  @HandleError("Can't get recognitions")
  async getRecognitions(dto: GetRecognitionDto) {
    const { search, startDate, endDate, page = 1, limit = 10 } = dto;

    const where: Prisma.RecognitionWhereInput = {};

    if (search) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { badge: { title: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (startDate || endDate) {
      where['createdAt'] = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.recognition.count({ where }),
      this.prisma.recognition.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          badge: true,
          recognitionUsers: {
            include: {
              user: {
                select: {
                  id: true,
                  profile: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return successResponse(
      {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Get All Recognition',
    );
  }

  @HandleError("Can't get single recognition")
  async getSingleRecognition(id: string): Promise<TResponse<any>> {
    const recognition = await this.prisma.recognition.findUnique({
      where: { id },
      include: {
        badge: true,
        recognitionUsers: {
          include: {
            user: {
              include: {
                profile: true,
              }
            }
          },
        },
      },
    });

    if (!recognition) {
      throw new AppError(404, 'Recognition not found');
    }

    return successResponse(recognition, 'Recognition Fetched Successfully');
  }
}
