import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ENVEnum } from '@project/common/enum/env.enum';
import { JWTPayload, UserTokenPayload } from '@project/common/jwt/jwt.interface';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/js/notification',
})
@Injectable()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotificationGateway.name);
  private readonly clients = new Map<string, Set<Socket>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
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
      console.log(`JWT payload: ${JSON.stringify(payload)}`);

      (client as any).user = payload;
      if (!payload.sub) {
        this.logger.warn('Invalid token payload: missing sub');
        return client.disconnect(true);
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, notificationToggle: true },
      });
      console.log(user);
      // const paloadForSocketClient = {}

      if (!user) {
        this.logger.warn('Invalid token payload: user not found');
        return client.disconnect(true);
      }

      this.subscribeClient(payload.sub, client);

      this.logger.log(`Client connected: ${payload.sub}`);
    } catch (err: any) {
      this.logger.warn(`JWT verification failed: ${err.message || err}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const user: UserTokenPayload | undefined = (client as any).user;
    if (user?.userId) {
      this.unsubscribeClient(user.userId, client);
      this.logger.log(`Client disconnected: ${user.userId}`);
    } else {
      this.logger.log('Client disconnected: unknown user');
    }
  }

  private extractTokenFromSocket(client: Socket): string | null {
    const authHeader =
      client.handshake.headers.authorization ||
      client.handshake.auth?.token;

    if (!authHeader) return null;

    if (authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    return authHeader; // * fallback if only raw token is passed
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

  public getClientsForUser(userId: string): Set<Socket> {
    return this.clients.get(userId) || new Set();
  }
}
