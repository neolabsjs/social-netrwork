import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IUser } from 'src/user/interface';

@WebSocketGateway()
export class NotificationService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private CLIENTS: { [userId: string]: Socket[] } = {};

  handleConnection(@ConnectedSocket() client: Socket): void {
    const userId = client.handshake.query?.userId as string;
    const clientId = client.id;
    if (userId && clientId) {
      this.CLIENTS[userId]?.length
        ? this.CLIENTS[userId].push(client)
        : (this.CLIENTS[userId] = [client]);
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = client.handshake.query?.userId as string;
    if (userId) {
      this.CLIENTS[userId] = this.CLIENTS[userId].filter(
        (hashClient) => hashClient.id != client.id,
      );
    }
  }

  sendNotification(message: string, user: IUser): void {
    const clients = this.CLIENTS[user?._id.toString()];
    if (clients?.length) {
      clients.map((client) => client.emit('notification', message));
    }
  }
}
