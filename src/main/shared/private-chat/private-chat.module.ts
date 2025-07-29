import { Module } from '@nestjs/common';
import { PrivateChatController } from './private-chat.controller';
import { PrivateChatService } from './private-chat.service';

@Module({
  controllers: [PrivateChatController],
  providers: [PrivateChatService]
})
export class PrivateChatModule {}
