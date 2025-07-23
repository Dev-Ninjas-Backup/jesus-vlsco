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
import { IncomingMessage } from 'http';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({
  path: '/notification',
  cors: {
    origin: '*',
  },
})
@Injectable()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);
  private readonly clients: Map<string, Set<WebSocket>> = new Map();

  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  handleConnection(client: WebSocket, ...args: any[]): void {
    const req = args[0] as IncomingMessage;
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('Missing or invalid Authorization header');
      client.close();
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwt.verify(token, {
        secret: this.configService.getOrThrow(ENVEnum.JWT_SECRET),
      });
      (client as any).user = decoded;

      this.subscribeClient(decoded.profileId, client);

      this.logger.log(
        `Client connected: ${decoded.profileId || 'unknown user'}`,
      );

      client.on('close', () => {
        this.handleDisconnect(client);
      });
    } catch (err) {
      this.logger.warn('JWT verification failed');
      client.close();
    }
  }

  handleDisconnect(client: WebSocket): void {
    // Get the user from the client
    const user = (client as any).user;

    if (user && user.sub) {
      this.unsubscribeClient(user.profileId, client);
      this.logger.debug(`Client disconnected: ${user.profileId}`);
    } else {
      this.logger.debug('Client disconnected: unknown user');
    }
  }

  private subscribeClient(clientId: string, client: WebSocket): void {
    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, new Set());
    }
    this.clients.get(clientId)!.add(client);
    this.logger.log(`Client subscribed to ${clientId}`);
  }

  private unsubscribeClient(clientId: string, client: WebSocket): void {
    const clients = this.clients.get(clientId);
    if (clients?.has(client)) {
      clients.delete(client);
      this.logger.log(`Client unsubscribed from ${clientId}`);

      // Clean up empty sets to prevent memory leaks
      if (clients.size === 0) {
        this.clients.delete(clientId);
        this.logger.debug(`Removed empty client set for ${clientId}`);
      }
    }
  }

  public async notifyUser(
    userId: string,
    message: Record<string, any>,
  ): Promise<void> {
    const clients = this.clients.get(userId);
    if (clients) {
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      }
    }
  }
}
