// team.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { SendTeamMessageDto } from './dto/send-team-message.dto';
import { sendTeamMessageSwaggerSchema } from './dto/send-team-message.swagger';
import { TeamchatService } from './teamchat.service';
import { TeamGateway } from './teamGateway/teamgeteway';

@ApiTags('Team Chat')
@Controller('teams')
@ValidateEmployee()
@ApiBearerAuth()
export class TeamController {
  constructor(
    private readonly teamService: TeamchatService,
    private readonly teamGateway: TeamGateway,
  ) {}
  @Get()
  @ApiOperation({ summary: 'All the teams' })
  async getTeamsWithLastMessage() {
    return this.teamService.getTeamsWithLastMessage();
  }

  @Post(':teamId/messages')
  @ApiOperation({ summary: 'Sending team message' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: sendTeamMessageSwaggerSchema.properties,
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async sendTeamMessage(
    @Param('teamId') teamId: string,
    @Body() dto: SendTeamMessageDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser('userId') userId: string,
  ) {
    const response = await this.teamService.sendTeamMessage(
      teamId,
      dto,
      file,
      userId,
    );

    // Emit new message to team via WebSocket
    this.teamGateway.emitNewMessage(teamId, response.data);

    return response;
  }
}
