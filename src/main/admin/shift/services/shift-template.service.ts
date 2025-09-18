import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import {
  GetAllShiftTemplateDto,
  ShiftTemplateDto,
  UpdateShiftTemplateDto,
} from '../dto/shift-template.dto';

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  job?: string;
}

@Injectable()
export class ShiftTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Error creating shift template')
  async create(dto: ShiftTemplateDto): Promise<TResponse<any>> {
    const shiftTemplate = await this.prisma.shiftTemplate.create({ data: dto });

    return successResponse(
      shiftTemplate,
      'Shift template created successfully',
    );
  }

  @HandleError('Error fetching shift templates')
  async findAll(
    params: GetAllShiftTemplateDto,
  ): Promise<TPaginatedResponse<any>> {
    const { page = 1, limit = 10, search, location, job } = params;

    const where: any = {};

    if (search) {
      where.templateTitle = { contains: search, mode: 'insensitive' };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (job) {
      where.job = { contains: job, mode: 'insensitive' };
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.shiftTemplate.count({ where }),
      this.prisma.shiftTemplate.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return successPaginatedResponse(
      data,
      {
        page,
        limit,
        total,
      },
      'Shift templates fetched successfully',
    );
  }

  @HandleError('Error fetching shift template')
  async findOne(id: string): Promise<TResponse<any>> {
    const shiftTemplate = await this.prisma.shiftTemplate.findUnique({
      where: { id },
    });
    if (!shiftTemplate) {
      throw new AppError(404, `Shift template with id ${id} not found`);
    }
    return successResponse(
      shiftTemplate,
      'Shift template fetched successfully',
    );
  }

  @HandleError('Error updating shift template')
  async update(
    id: string,
    dto: UpdateShiftTemplateDto,
  ): Promise<TResponse<any>> {
    await this.findOne(id); // ensures it exists
    const updatedShitTemplate = await this.prisma.shiftTemplate.update({
      where: { id },
      data: dto,
    });

    return successResponse(
      updatedShitTemplate,
      'Shift template updated successfully',
    );
  }

  @HandleError('Error deleting shift template')
  async remove(id: string): Promise<TResponse<any>> {
    await this.findOne(id); // ensures it exists
    await this.prisma.shiftTemplate.delete({
      where: { id },
    });

    return successResponse(null, 'Shift template deleted successfully');
  }
}
