import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Room {
  id: string;
  users: Map<
    string,
    { socketId: string; name: string; color: string; lastActive: number }
  >;
  projectState: any;
  lastStateUpdate: number;
}
interface ComponentChange {
  userId: string;
  type: 'add' | 'remove' | 'update' | 'move';
  id: string;
  timestamp: number;
  data: Record<string, any>; // o algo más específico si sabes
}

interface CursorPosition {
  userId: string;
  userName: string;
  x: number;
  y: number;
  timestamp: number;
}

@WebSocketGateway({
  cors: {
    origin: '*', // En producción, establecer esto a tu URL frontend
  },
})
export class CollaborationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private rooms: Map<string, Room> = new Map();

  // Historial de cambios para recuperación y manejo de conflictos
  private changeHistory: Map<string, ComponentChange[]> = new Map();

  handleConnection(client: Socket) {
    const { roomId, userId, userName, userColor } = client.handshake.query;

    if (!roomId || !userId || Array.isArray(roomId) || Array.isArray(userId)) {
      client.disconnect();
      return;
    }

    // Añadir usuario a la sala
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        users: new Map([
          [
            userId,
            {
              socketId: client.id,
              name: userName as string,
              color: userColor as string,
              lastActive: Date.now(),
            },
          ],
        ]),
        projectState: null,
        lastStateUpdate: 0,
      });

      // Inicializar historial de cambios para esta sala
      this.changeHistory.set(roomId, []);
      // console.log('Nueva conexión a la sala', client.handshake.query);
    } else {
      this.rooms.get(roomId)?.users.set(userId, {
        socketId: client.id,
        name: userName as string,
        color: userColor as string,
        lastActive: Date.now(),
      });
    }

    // Unirse a la sala Socket.IO
    client.join(roomId);

    // Notificar a otros que un nuevo usuario se unió
    const room = this.rooms.get(roomId);
    const activeUsers = room
      ? Array.from(room.users.entries()).map(([id, data]) => ({
          id,
          active: true,
          name: data.name,
          color: data.color,
        }))
      : [];

    client.emit('room-users', activeUsers);
    client.to(roomId).emit('user-joined', {
      userId,
      allUsers: activeUsers,
    });

    console.log(`Usuario ${userId} conectado a sala ${roomId}`);
  }

  handleDisconnect(client: Socket) {
    const { roomId, userId } = client.handshake.query;

    if (!roomId || !userId || Array.isArray(roomId) || Array.isArray(userId)) {
      return;
    }

    // Eliminar usuario de la sala
    if (this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId);
      room?.users.delete(userId);

      // Si la sala está vacía, eliminarla después de un tiempo
      if (room?.users.size === 0) {
        setTimeout(() => {
          // Verificar nuevamente si aún está vacía antes de eliminar
          if (
            this.rooms.has(roomId) &&
            this.rooms.get(roomId)?.users.size === 0
          ) {
            this.rooms.delete(roomId);
            this.changeHistory.delete(roomId);
            console.log(`Sala ${roomId} eliminada por inactividad`);
          }
        }, 60000); // Mantener sala vacía por 1 minuto antes de eliminar
      } else {
        const activeUsers = room
          ? Array.from(room.users.entries()).map(([id, data]) => ({
              id,
              name: data.name,
              color: data.color,
            }))
          : [];

        this.server.to(roomId).emit('room-users', activeUsers);
        // Notificar a otros que el usuario se fue
        this.server.to(roomId).emit('user-left', { id: userId });
      }
    }

    console.log(`Usuario ${userId} desconectado de sala ${roomId}`);
  }

  @SubscribeMessage('get-initial-state')
  handleGetInitialState(client: Socket, roomId: string) {
    const room = this.rooms.get(roomId);

    if (room && room.projectState) {
      client.emit('initial-state', room.projectState);
    }
  }

  @SubscribeMessage('save-project-state')
  handleSaveProjectState(client: Socket, payload: unknown) {
    const { roomId, state, timestamp } = payload as {
      roomId: string;
      state: Record<string, unknown>;
      timestamp: number;
    };

    if (this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId);

      // Solo actualizar si este estado es más reciente que el último guardado
      if (room && (!room.lastStateUpdate || timestamp > room.lastStateUpdate)) {
        room.projectState = state as object; // puedes usar un tipo más específico si lo sabes
        room.lastStateUpdate = timestamp;
        // console.log(`Estado del proyecto actualizado para sala ${roomId}`);
      }
    }
  }

  @SubscribeMessage('component-change')
  handleComponentChange(client: Socket, change: ComponentChange) {
    const { roomId } = client.handshake.query;

    if (!roomId || Array.isArray(roomId)) return;

    // Registrar el cambio en el historial para esta sala
    if (this.changeHistory.has(roomId)) {
      const history = this.changeHistory.get(roomId);
      history?.push(change);

      // Limitar el tamaño del historial
      if (history!.length > 1000) {
        history?.shift(); // Eliminar el cambio más antiguo
      }
    }

    // Actualizar la última actividad del usuario
    const room = this.rooms.get(roomId);
    const user = room?.users.get(change.userId);
    if (user) {
      user.lastActive = Date.now();
    }

    // Transmitir a todos los clientes en la sala excepto al remitente
    client.to(roomId).emit('component-change', change);
  }

  @SubscribeMessage('cursor-position')
  handleCursorPosition(client: Socket, position: CursorPosition) {
    const { roomId } = client.handshake.query;

    if (!roomId || Array.isArray(roomId)) return;

    // Actualizar la última actividad del usuario
    const room = this.rooms.get(roomId);
    const user = room?.users.get(position.userId);
    if (user) {
      user.lastActive = Date.now();
    }

    // Transmitir posición del cursor a todos los clientes en la sala excepto al remitente
    client.to(roomId).emit('cursor-position', position);
  }

  // Nuevo método para obtener todos los cambios para un componente específico
  @SubscribeMessage('get-component-history')
  handleGetComponentHistory(
    client: Socket,
    payload: { roomId: string; componentId: string },
  ) {
    const { roomId, componentId } = payload;

    if (this.changeHistory.has(roomId)) {
      const history = this.changeHistory.get(roomId);
      const componentHistory = (history ?? []).filter(
        (change) => change.id === componentId,
      );

      client.emit('component-history', {
        componentId,
        history: componentHistory,
      });
    }
  }

  @SubscribeMessage('get-room-users')
  handleGetRoomUsers(client: Socket) {
    const { roomId } = client.handshake.query;

    if (!roomId || Array.isArray(roomId)) return;

    const room = this.rooms.get(roomId);
    if (room) {
      const activeUsers = Array.from(room.users.entries()).map(
        ([id, data]) => ({
          id,
          name: data.name,
          color: data.color,
        }),
      );
      client.emit('room-users', activeUsers);
    }
  }
}
