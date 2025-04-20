import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class GrapesJsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  users = new Map<string, { name: string; color: string }>();

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server started');
  }

  handleConnection(client: Socket) {
    console.log('Client connected');
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client);
    this.users.delete(client.id);
    this.server.emit('cursor-remove', client.id);

    this.server.emit(
      'update-users',
      Array.from(this.users.entries()).map(([id, user]) => ({
        id,
        name: user.name,
        color: user.color,
      })),
    );
  }

  @SubscribeMessage('update-project')
  handleUpdateProject(client: Socket, data: any) {
    client.broadcast.emit('sync-project', data);
  }
  @SubscribeMessage('update-component')
  handleUpdateComponent(client: Socket, data: any) {
    client.broadcast.emit('update-component', data);
  }

  @SubscribeMessage('cursor-move')
  handleCursorMove(client: Socket, data: any) {
    client.broadcast.emit('remove-cursor', data);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: { userName: string; userColor: string }) {
    this.users.set(client.id, {
      name: payload.userName,
      color: payload.userColor,
    });

    console.log(
      `Usuario ${payload.userName} conectado con color ${payload.userColor}`,
    );
    this.server.emit(
      'update-users',
      Array.from(this.users.entries()).map(([id, user]) => ({
        id,
        name: user.name,
        color: user.color,
      })),
    );
  }
}
