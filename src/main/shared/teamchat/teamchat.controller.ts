// team.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SendTeamMessageDto } from './dto/send-team-message.dto';
import { TeamchatService } from './teamchat.service';
import { GetUser } from '@project/common/jwt/jwt.decorator';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamchatService) {}

  @Post(':teamId/messages')
  @UseInterceptors(FileInterceptor('file'))
  async sendTeamMessage(
    @Param('teamId') teamId: string,
    @Body() dto: SendTeamMessageDto,
    @UploadedFile() file: Express.Multer.File,
   @GetUser('userId') userId: string,
  ) {
    return this.teamService.sendTeamMessage(teamId, dto, file, userId);
  }
}
