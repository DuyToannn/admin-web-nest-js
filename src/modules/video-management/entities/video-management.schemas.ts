import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type VideoManagementDocument = HydratedDocument<VideoManagement>;

@Schema({ timestamps: true })
export class VideoManagement {

  @Prop({ required: true })
  idVideo: string;
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  rlkey: string;

  @Prop({ required: true })
  st: string;
  @Prop({ required: true })
  fullUrl: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: false })
  title?: string;

  @Prop({ required: false })
  duration?: number;
}

export const VideoManagementSchema = SchemaFactory.createForClass(VideoManagement);
