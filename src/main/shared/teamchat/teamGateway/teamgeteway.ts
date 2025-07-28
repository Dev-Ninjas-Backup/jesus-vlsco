// team.gateway.ts
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
import { TeamchatService } from '../teamchat.service';
import { SendTeamMessageDto } from '../dto/send-team-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/teams',
})
export class TeamGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly teamService: TeamchatService) {}

  handleConnection(client: Socket) {
    const { teamId } = client.handshake.query;
    if (teamId) {
      client.join(teamId);
    }
    console.log(`Client connected: ${client.id} joined team ${teamId}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('team:send_message')
  async handleMessage(
    @MessageBody()
    payload: {
      teamId: string;
      dto: SendTeamMessageDto;
      file: Express.Multer.File;
      userId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { teamId, dto, userId,file } = payload;

    const message = await this.teamService.sendTeamMessage(teamId, dto,file , userId);

    this.server.to(teamId).emit('team:new_message', message.data); // broadcast
  }

  // You can expose this to the service
  emitNewMessage(teamId: string, message: any) {
    this.server.to(teamId).emit('team:new_message', message);
  }
}
