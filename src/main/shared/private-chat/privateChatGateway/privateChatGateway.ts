import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import { PrivateChatService } from '../private-chat.service';
import { SendPrivateMessageDto } from '../dto/privateChatGateway.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/private',
})
export class PrivateChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly privateChatService: PrivateChatService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      client.disconnect();
      console.log('Missing token');
      return;
    }

    try {
      const jwtSecret = this.configService.get<string>(ENVEnum.JWT_SECRET);
      const payload: any = jwt.verify(token, jwtSecret as string);
      const userId = payload.sub;

      client.data.userId = userId;
      client.join(userId); // join room with userId

      console.log(`Private chat: User ${userId} connected, socket ${client.id}`);
    } catch (err) {
      client.disconnect();
      console.log(`Auth failed: ${err.message}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Private chat disconnected: ${client.id}`);
  }

  @SubscribeMessage('private:send_message')
  async handlePrivateMessage(
    @MessageBody()
    payload: {
      recipientId: string;
      dto: SendPrivateMessageDto;
      file?: Express.Multer.File;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.userId;
    const { recipientId, dto, file } = payload;

    // Ensure sender != recipient
    if (senderId === recipientId) {
      console.log('Sender cannot message themselves.');
      return;
    }

    // Get or create conversation
    const conversation = await this.privateChatService.findOrCreateConversation(
      senderId,
      recipientId,
    );

    // Send message
    const message = await this.privateChatService.sendPrivateMessage(
      conversation.id,
      senderId,
      dto,
      file,
    );

    // Emit to both participants
    this.server.to(senderId).emit('private:new_message', message);
    this.server.to(recipientId).emit('private:new_message', message);
  }

  emitToUser(userId: string, event: string, payload: any) {
    this.server.to(userId).emit(event, payload);
  }
}
