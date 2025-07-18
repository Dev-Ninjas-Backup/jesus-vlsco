import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { AddRecognitionDto } from '../dto/add-recognition.dto';
import { successResponse, TResponse } from '@project/common/utils/response.util';

@Injectable()
export class AddRecognitionService {
    constructor(private readonly prisma:PrismaService){}

    async addRecognition (dto:AddRecognitionDto):Promise<TResponse<any>>{
        // validate input if needed
    if (!dto.recognitionUserIds?.length) {
      throw new BadRequestException('At least one user must be recognized');
    }
    
    const result = await this.prisma.$transaction(async (tx) => {
      // Step 1: Create Recognition
      const recognition = await tx.recognition.create({
        data: {
          badgeId: dto.badgeId,
          message: dto.message,
          visibility: dto.visibility,
          shouldNotify: dto.shouldNotify,
          isAllowedToLike: dto.isAllowedToLike,
        },
      });

      // Step 2: Create RecognitionUser entries
      const recognitionUsersData = dto.recognitionUserIds.map((userId) => ({
        recognitionId: recognition.id,
        userId,
      }));

      await tx.recognitionUser.createMany({
        data: recognitionUsersData,
        skipDuplicates: true, // just in case
      });

      return {
        message: 'Recognition created successfully',
        recognitionId: recognition.id,
        recipients: dto.recognitionUserIds,
      };
    });

    return successResponse(result,result.message)
    }
}
