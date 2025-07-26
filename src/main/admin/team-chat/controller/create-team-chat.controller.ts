import { Controller } from '@nestjs/common';
import { CreateTeamChatService } from '../services/create-team-chat.service';


@Controller('create-team-chat')
export class CreateTeamChatController {
    constructor(private readonly createTeamChat:CreateTeamChatService){}
    async createTeamChatGroup(){

    }
}
