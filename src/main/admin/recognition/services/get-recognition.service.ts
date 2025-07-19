import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetRecognitionDto } from '../dto/recognition.dto';
import { Prisma } from '@prisma/client';
import { successResponse } from '@project/common/utils/response.util';

@Injectable()
export class GetRecognitionService {
  constructor(private readonly prisma: PrismaService) {}

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
}
