import { Module } from '@nestjs/common';
import { VideoManagementService } from './video-management.service';
import { VideoManagementController } from './video-management.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSchema } from '../videos/schemas/video.schemas';
import { VideoManagement, VideoManagementSchema } from './entities/video-management.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: VideoManagement.name, schema: VideoManagementSchema }]),
  ],
  controllers: [VideoManagementController],
  providers: [VideoManagementService],
})
export class VideoManagementModule {}
