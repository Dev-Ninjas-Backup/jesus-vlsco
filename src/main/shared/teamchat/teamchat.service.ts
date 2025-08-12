import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { SendTeamMessageDto } from './dto/send-team-message.dto';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { UtilsService } from '@project/lib/utils/utils.service';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { FileService } from '@project/lib/utils/file.service';

@Injectable()
export class TeamchatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    private readonly file: FileService,
  ) {}

  // team.service.ts

  @HandleError('Failed to send team message')
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
      const uploadfile = await this.file.processUploadedFile(file);
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

    // 4. Update team's last message
    await this.prisma.team.update({
      where: { id: teamId },
      data: { lastMessageId: message.id },
    });

    return successResponse(message, 'Message sent successfully');
  }

  @HandleError('Checking Failed')
  async checkUserInTeam(teamId: string, userId: string): Promise<boolean> {
    const team = await this.prisma.team.findFirst({
      where: {
        id: teamId,
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return !!team;
  }

  @HandleError('Failed to get teams list')
  async getTeamsWithLastMessage(): Promise<TResponse<any>> {
    const teams = await this.prisma.team.findMany({
      include: {
        lastMessage: {
          include: {
            sender: {
              select: {
                id: true,
                profile: {
                  select: {
                    profileUrl: true,
                    firstName: true,
                    lastName: true,
                  },
                },
                email: true,
              },
            },
            file: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    profileUrl: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return successResponse(teams, 'Teams fetched successfully');
  }
}
