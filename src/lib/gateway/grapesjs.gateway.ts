import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';

interface ProjectData {
  pages: any[];
  styles: any[];
  components: any[];
  assets?: any[];
}

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
  path: '/socket.io',
})
export class GrapesJsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private users = new Map<
    string,
    { name: string; color: string; room: string }
  >();
  private latestProjectData: Record<string, ProjectData> = {};

  afterInit() {
    console.log('WebSocket server started');
  }

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }
  private broadcastUsers(room?: string) {
    if (!room) return;
    const list = [...this.users.entries()]
      .filter(([, u]) => u.room === room)
      .map(([id, u]) => ({ id, ...u }));
    this.server.to(room).emit('update-users', list);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
    const user = this.users.get(client.id);
    if (user) client.to(user.room).emit('cursor-remove', client.id);
    this.users.delete(client.id);
    this.broadcastUsers(user?.room);
  }

  @SubscribeMessage('join')
  joinRoom(
    client: Socket,
    payload: { shareId: string; userName: string; userColor: string },
  ) {
    const { shareId, userName, userColor } = payload;
    client.join(shareId);
    this.users.set(client.id, {
      name: payload.userName,
      color: payload.userColor,
      room: payload.shareId,
    });

    client.emit('sync-project', this.latestProjectData[shareId] ?? null);
    this.broadcastUsers(shareId);
    console.log(`Usuario ${userName} conectado en sala ${userColor}`);
  }

  @SubscribeMessage('add-component')
  handleAddComponent(client: Socket, data: any) {
    const room = this.users.get(client.id)?.room;
    client.to(room!).emit('add-component', data);
  }

  @SubscribeMessage('update-component')
  handleUpdateComponent(client: Socket, data: any) {
    const room = this.users.get(client.id)?.room;
    client.to(room!).emit('update-component', data);
  }

  @SubscribeMessage('remove-component')
  handleRemoveComponent(client: Socket, data: { id: string }) {
    const room = this.users.get(client.id)?.room;
    client.to(room ?? '').emit('remove-component', data);
  }

  @SubscribeMessage('cursor-move')
  handleCursorMove(client: Socket, data: any) {
    const room = this.users.get(client.id)?.room;
    client.to(room!).emit('remote-cursor', data);
  }

  @SubscribeMessage('update-project')
  handleUpdateProject(client: Socket, data: ProjectData) {
    const room = this.users.get(client.id)?.room;
    if (room) this.latestProjectData[room] = data;
  }
}
