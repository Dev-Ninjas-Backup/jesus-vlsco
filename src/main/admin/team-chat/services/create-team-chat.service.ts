import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateTeamChatDto } from '../dto/create-team-chat.dto';

@Injectable()
export class CreateTeamChatService {
    constructor(private readonly prisma:PrismaService){}

    async createTeamChat(dto:CreateTeamChatDto){
        
    }
}
