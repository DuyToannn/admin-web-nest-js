import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { Video, VideoSchema } from './schemas/video.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from '../categories/categories.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';
import { DropboxManageModule } from '../dropbox-manage/dropbox-manage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    CategoriesModule,
    CloudinaryModule,
    UsersModule,
    DropboxManageModule
  ], controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule { }
