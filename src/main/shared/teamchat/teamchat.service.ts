import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { SendTeamMessageDto } from './dto/send-team-message.dto';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { UtilsService } from '@project/lib/utils/utils.service';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { FileService } from '@project/lib/utils/file.service';

@Injectable()
export class TeamchatService {
    constructor(private readonly prisma:PrismaService,private readonly utils: UtilsService,private readonly file:FileService){}

    // team.service.ts

@HandleError('Failed to send team message')
async sendTeamMessage(
  teamId: string,
  dto: SendTeamMessageDto,
  file: Express.Multer.File,
  senderId: string,
): Promise<TResponse<any>> {
  await this.utils.ensureTeamExists(teamId);
  await this.utils.ensureUserExists(senderId);
  await this.utils.ensureMemberExistsInTeam(teamId, senderId);

  // 1. Upload file if provided
  let fileId: string | null = null;
  if (file) {
   const uploadfile = await this.file.processUploadedFile(file); // implement this
    fileId = uploadfile.id;
  }

  // 2. Create message
  const message = await this.prisma.teamMessage.create({
    data: {
      content: dto.content,
      fileId,
      teamId,
      senderId,
    },
    include: {
      sender: true,
      file: true,
    },
  });

  // 3. Set initial message statuses
  const teamMembers = await this.prisma.teamMembers.findMany({
    where: { teamId },
  });

  await this.prisma.teamMessageStatus.createMany({
    data: teamMembers.map((member) => ({
      messageId: message.id,
      userId: member.userId,
      status: 'SENT',
    })),
    skipDuplicates: true,
  });

  return successResponse(message, 'Message sent successfully');
}

}
