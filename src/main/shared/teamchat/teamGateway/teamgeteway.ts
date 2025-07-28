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
import * as jwt from 'jsonwebtoken'; // or use your JwtService
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/teams',
})
export class TeamGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly teamService: TeamchatService,
    private readonly configService: ConfigService, // to access JWT_SECRET
  ) {}

  async handleConnection(client: Socket) {
    // const { teamId, token } = client.handshake.query;
    console.log(client.handshake.headers.authorization,'token',client.handshake.query.teamId,'query')
    const token = (client.handshake.headers.authorization)?.split(' ')[1]
    const teamId = client.handshake.query.teamId
    if (!token || !teamId) {
      client.disconnect();
      console.log(`Missing token or teamId`);
      return;
    }

    try {
      // Verify token
      const jwtSecret = this.configService.get<string>(ENVEnum.JWT_SECRET);
      if (!jwtSecret) {
        client.disconnect();
        console.log('JWT secret is not configured');
        return;
      }
      const payload: any = jwt.verify(token as string, jwtSecret);
      const userId = payload.sub;

      // Check membership
      const isMember = await this.teamService.checkUserInTeam(teamId as string, userId);
      if (!isMember) {
        client.disconnect();
        console.log(`Access denied: User ${userId} not in team ${teamId}`);
        return;
      }

      client.data.userId = userId;
      client.join(teamId as string);

      console.log(`Client ${userId} connected: ${client.id} joined team ${teamId}`);
    } catch (err) {
      client.disconnect();
      console.log(`Authentication failed: ${err.message}`);
    }
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
    const { teamId, dto, userId, file } = payload;

    // Make sure the userId in payload matches the one from the socket
    if (client.data.userId !== userId) {
      console.log(`User ID mismatch: client ${client.data.userId} vs payload ${userId}`);
      return;
    }

    // Verify again for added safety
    const isMember = await this.teamService.checkUserInTeam(teamId, userId);
    if (!isMember) {
      console.log(`Unauthorized message attempt by user ${userId} in team ${teamId}`);
      return;
    }

    const message = await this.teamService.sendTeamMessage(teamId, dto, file, userId);

    this.server.to(teamId).emit('team:new_message', message.data);
  }

  emitNewMessage(teamId: string, message: any) {
    this.server.to(teamId).emit('team:new_message', message);
  }
}
