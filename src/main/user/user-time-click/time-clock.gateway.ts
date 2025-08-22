import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PrismaService } from "@project/lib/prisma/prisma.service";

import { ENVEnum } from "@project/common/enum/env.enum";
import { JWTPayload } from "@project/common/jwt/jwt.interface";
import { Server, Socket } from "socket.io";
import { ClockInOutService } from "./services/clock-in-out.service";

@WebSocketGateway({
  namespace: '/js/clock',
  cors: {
    origin: '*',
  },
})
export class TimeClockGateway

  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(TimeClockGateway.name);
  private readonly clients = new Map<string, Set<Socket>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly clockService: ClockInOutService
  ) { }

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log('Socket.IO server initialized', server.adapter.name);
  }

  async handleConnection(client: Socket) {
    try {
      const token = this.extractTokenFromSocket(client);
      if (!token) {
        this.logger.warn('Missing token');
        return client.disconnect(true);
      }

      const payload = this.jwtService.verify<JWTPayload>(token, {
        secret: this.configService.getOrThrow(ENVEnum.JWT_SECRET),
      });

      if (!payload.sub) {
        this.logger.warn('Invalid token payload: missing sub');
        return client.disconnect(true);
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          notificationToggle: true,
        },
      });

      if (!user) {
        this.logger.warn(`User not found for ID: ${payload.sub}`);
        return client.disconnect(true);
      }

      client.data = { user: user };
      this.subscribeClient(user.id, client);

      this.logger.log(`Client connected: ${user.id}`);
    } catch (err: any) {
      this.logger.warn(`JWT verification failed: ${err.message || err}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.user?.sub;
    if (userId) {
      this.unsubscribeClient(userId, client);
      this.logger.log(`Client disconnected: ${userId}`);
    } else {
      this.logger.log('Client disconnected: unknown user');
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
    this.logger.debug(`Subscribed client to user ${userId}`);
  }

  private unsubscribeClient(userId: string, client: Socket) {
    const set = this.clients.get(userId);
    if (!set) return;

    set.delete(client);
    this.logger.debug(`Unsubscribed client from user ${userId}`);
    if (set.size === 0) {
      this.clients.delete(userId);
      this.logger.debug(`Removed empty client set for user ${userId}`);
    }
  }

  public async notifySingleUser(
    userId: string,
    event: string,
    data: Notification,
  ): Promise<void> {
    const clients = this.clients.get(userId) || new Set();
    if (clients.size === 0) {
      this.logger.warn(`No clients connected for user ${userId}`);
      return;
    }

    clients.forEach((client) => {
      client.emit(event, data);
      this.logger.log(`Notification sent to user ${userId} via event ${event}`);
    });
  }

  @SubscribeMessage('location-update')
  async handleLocationUpdate(
    @MessageBody() data: { userId: string; lat: number; lng: number },
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.clockService.processClock(data.userId, data.lat, data.lng);

    // Push status update back to client
    client.emit('clock-status', result);
  }
}
