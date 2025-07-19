import { Injectable, NotFoundException } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateRecognitionDto } from '../dto/update-recognition.dto';

@Injectable()
export class UpdateRecognitionService {
  constructor(private readonly prisma: PrismaService) {}

  // Update Recognition
  @HandleError('Recognition Update Failed')
  async updateRecognition(
    id: string,
    dto: UpdateRecognitionDto,
  ): Promise<TResponse<any>> {
    const recognition = await this.prisma.recognition.findUnique({
      where: { id },
    });

    if (!recognition) {
      throw new NotFoundException('Recognition not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // Step 1: Update Recognition base data
      const updatedRecognition = await tx.recognition.update({
        where: { id },
        data: {
          badgeId: dto.badgeId,
          message: dto.message,
          visibility: dto.visibility,
          shouldNotify: dto.shouldNotify,
          isAllowedToLike: dto.isAllowedToLike,
        },
      });

      // Step 2: Update recognitionUserIds if provided
      if (dto.recognitionUserIds) {
        // Get current users
        const current = await tx.recognitionUser.findMany({
          where: { recognitionId: id },
          select: { userId: true },
        });

        const currentUserIds = current.map((r) => r.userId);
        const newUserIds = dto.recognitionUserIds;

        // Determine which to add and which to remove
        const toAdd = newUserIds.filter((id) => !currentUserIds.includes(id));
        const toRemove = currentUserIds.filter(
          (id) => !newUserIds.includes(id),
        );

        if (toRemove.length) {
          await tx.recognitionUser.deleteMany({
            where: {
              recognitionId: id,
              userId: { in: toRemove },
            },
          });
        }

        if (toAdd.length) {
          await tx.recognitionUser.createMany({
            data: toAdd.map((userId) => ({
              recognitionId: id,
              userId,
            })),
            skipDuplicates: true,
          });
        }
      }

      return {
        message: 'Recognition updated successfully',
        updatedRecognitionId: updatedRecognition.id,
      };
    });

    return successResponse(result, result.message);
  }

  // Delete Recogniton
  @HandleError('Recognition Deleted Failed')
  async deleteRecognition(id: string): Promise<TResponse<any>> {
    const existing = await this.prisma.recognition.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Recognition not found');
    }

    await this.prisma.$transaction(async (tx) => {
      // Delete related RecognitionUser entries
      await tx.recognitionUser.deleteMany({
        where: { recognitionId: id },
      });

      // Optionally delete comments/likes if your schema includes them
      await tx.recognitionLikeComment.deleteMany({
        where: { recognitionId: id },
      });

      // Delete the recognition itself
      await tx.recognition.delete({
        where: { id },
      });
    });

    return successResponse(null, 'Recognition deleted successfully');
  }
}
