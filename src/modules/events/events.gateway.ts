// src/modules/events/events.gateway.ts
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema'; // Ensure correct path

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(@InjectModel(User.name) private userModel: Model<User>) { } // Inject Model<UserDocument>

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string; // Cast to string if necessary

    // Update user status to online
    await this.userModel.findByIdAndUpdate(userId, { isOnline: true });
    console.log(`User ${userId} is online`);
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string; // Cast to string if necessary

    // Update user status to offline
    await this.userModel.findByIdAndUpdate(userId, { isOnline: false });
    console.log(`User ${userId} is offline`);
  }
}
