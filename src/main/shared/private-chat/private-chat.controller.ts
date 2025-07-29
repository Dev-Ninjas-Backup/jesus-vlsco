import { Body, Controller, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { PrivateChatService } from './private-chat.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SendPrivateMessageDto } from './dto/privateChatGateway.dto';
import { sendPrivateMessageSwaggerSchema } from './dto/privateChatGateway.swagger';

@Controller('private-chat')
@ValidateEmployee()
@ApiBearerAuth()
export class PrivateChatController {

    constructor(private readonly privateService:PrivateChatService){}

    @ApiOperation({ summary: 'Sending Private message' })
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: sendPrivateMessageSwaggerSchema.properties,
        },
      })
      @UseInterceptors(FileInterceptor('file'))
      async sendTeamMessage(
        @Param('recipientId') recipientId: string,
        @Body() dto: SendPrivateMessageDto,
        @UploadedFile() file: Express.Multer.File,
        @GetUser('userId') senderId: string,
      ) {
       // Prevent sending message to self
    if (recipientId === senderId) {
      throw new Error('Cannot send message to yourself');
    }

    const conversation = await this.privateService.findOrCreateConversation(
      senderId,
      recipientId,
    );

    const message = await this.privateService.sendPrivateMessage(
      conversation.id,
      senderId,
      dto,
      file,
    );

    return { success: true, message };
      }
}
