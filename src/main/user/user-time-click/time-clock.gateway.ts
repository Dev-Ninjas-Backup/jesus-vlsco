import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PrismaService } from '@project/lib/prisma/prisma.service';

import { ENVEnum } from '@project/common/enum/env.enum';
import { JWTPayload } from '@project/common/jwt/jwt.interface';
import { Server, Socket } from 'socket.io';
import { ClockInOutService } from './services/clock-in-out.service';

@WebSocketGateway({
  namespace: '/js/clock',
  cors: { origin: '*' },
})
export class TimeClockGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(TimeClockGateway.name);
  private readonly clients = new Map<string, Set<Socket>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly clockService: ClockInOutService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log(
      `Socket.IO initialized with adapter: ${server.adapter.name}`,
    );
  }

  async handleConnection(client: Socket) {
    try {
      const token = this.extractTokenFromSocket(client);
      if (!token) return client.disconnect();

      const payload = this.jwtService.verify<JWTPayload>(token, {
        secret: this.configService.getOrThrow(ENVEnum.JWT_SECRET),
      });

      if (!payload.sub) return client.disconnect();

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true },
      });

      if (!user) return client.disconnect();

      client.data.userId = user.id;
      this.subscribeClient(user.id, client);

      this.logger.log(`Client connected: ${user.id}`);
    } catch (err: any) {
      this.logger.warn(`JWT verification failed: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      this.unsubscribeClient(userId, client);
      this.logger.log(`Client disconnected: ${userId}`);
    }
  }

  private extractTokenFromSocket(client: Socket): string | null {
    const authHeader =
      client.handshake.headers.authorization || client.handshake.auth?.token;
    if (!authHeader) return null;

    return authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;
  }

  private subscribeClient(userId: string, client: Socket) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(client);
  }

  private unsubscribeClient(userId: string, client: Socket) {
    const set = this.clients.get(userId);
    if (!set) return;

    set.delete(client);
    if (set.size === 0) this.clients.delete(userId);
  }

  @SubscribeMessage('location-update')
  async handleLocationUpdate(
    @MessageBody() data: { lat: number; lng: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data?.userId;
    if (!userId) {
      this.logger.warn('User ID not found');
      return client.disconnect();
    }

    this.logger.log(`Location update for user: ${userId}`);

    const result = await this.clockService.processClock(
      userId,
      data.lat,
      data.lng,
    );

    this.logger.log('Process Clock', result);

    client.emit('clock-status', result);
  }
}
