import { Injectable, NotFoundException } from '@nestjs/common'; // ← import your file service
import { PrivateMessage } from '@prisma/client';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { FileService } from '@project/lib/utils/file.service';
import { SendPrivateMessageDto } from './dto/privateChatGateway.dto';
import { successResponse } from '@project/common/utils/response.util';

@Injectable()
export class PrivateChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async getAllChatsWithLastMessage(userId: string) {
    // 1️⃣ Private chats
    const privateChats = await this.prisma.privateConversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
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
              },
            },
            file: true,
          },
        },
        user1: {
          select: {
            id: true,
            profile: {
              select: {
                profileUrl: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        user2: {
          select: {
            id: true,
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
      orderBy: { updatedAt: 'desc' },
    });

    const formattedPrivateChats = privateChats.map((chat) => {
      const otherUser = chat.user1Id === userId ? chat.user2 : chat.user1;
      return {
        type: 'private',
        chatId: chat.id,
        participant: otherUser,
        lastMessage: chat.lastMessage
          ? {
              id: chat.lastMessage.id,
              content: chat.lastMessage.content,
              createdAt: chat.lastMessage.createdAt,
              sender: chat.lastMessage.sender,
              file: chat.lastMessage.file,
            }
          : null,
        updatedAt: chat.updatedAt,
      };
    });

    // 2️⃣ Team chats (if you have lastMessageId in Team as well)
    const teamChats = await this.prisma.team.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
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
              },
            },
            file: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formattedTeamChats = teamChats.map((team) => ({
      type: 'team',
      chatId: team.id,
      title: team.title,
      lastMessage: team.lastMessage
        ? {
            id: team.lastMessage.id,
            content: team.lastMessage.content,
            createdAt: team.lastMessage.createdAt,
            sender: team.lastMessage.sender,
            file: team.lastMessage.file,
          }
        : null,
      updatedAt: team.updatedAt,
    }));

    // 3️⃣ Merge & sort
    const allChats = [...formattedPrivateChats, ...formattedTeamChats].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );

    return successResponse(allChats, 'Chats fetched successfully');
  }

  async findOrCreateConversation(userA: string, userB: string) {
    const [user1Id, user2Id] = [userA, userB].sort(); // enforce consistent ordering

    let conversation = await this.prisma.privateConversation.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id,
          user2Id,
        },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.privateConversation.create({
        data: { user1Id, user2Id },
      });
    }

    return conversation;
  }

  async sendPrivateMessage(
    conversationId: string,
    senderId: string,
    dto: SendPrivateMessageDto,
    file?: Express.Multer.File,
  ): Promise<PrivateMessage & { file?: any; sender: any }> {
    let fileRecord;

    if (file) {
      fileRecord = await this.fileService.processUploadedFile(file);
    }

    const message = await this.prisma.privateMessage.create({
      data: {
        content: dto.content,
        conversationId,
        senderId,
        fileId: fileRecord?.id,
      },
      include: {
        sender: true,
        file: true,
      },
    });

    // Fetch both participants to assign delivery status
    const conversation = await this.prisma.privateConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    await this.prisma.privateMessageStatus.createMany({
      data: [
        {
          messageId: message.id,
          userId: conversation.user1Id,
          status: 'DELIVERED',
        },
        {
          messageId: message.id,
          userId: conversation.user2Id,
          status: 'DELIVERED',
        },
      ],
      skipDuplicates: true,
    });

    return message;
  }

  async getConversationMessages(conversationId: string) {
    return this.prisma.privateMessage.findMany({
      where: { conversationId },
      include: {
        sender: true,
        file: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUserConversations(userId: string) {
    return this.prisma.privateConversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: { file: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
