import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UsersModule } from '../users/users.module'; // Adjust path if necessary

@Module({
  imports: [UsersModule], // Import the module providing UserModel
  providers: [EventsGateway],
})
export class EventsModule {}