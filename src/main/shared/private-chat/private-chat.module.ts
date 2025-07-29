import { Module } from '@nestjs/common';
import { PrivateChatController } from './private-chat.controller';
import { PrivateChatService } from './private-chat.service';
import { FileService } from '@project/lib/utils/file.service';
import { PrivateChatGateway } from './privateChatGateway/privateChatGateway';

@Module({
  controllers: [PrivateChatController],
  providers: [PrivateChatService,FileService,PrivateChatGateway]
})
export class PrivateChatModule {}
