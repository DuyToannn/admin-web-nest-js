import { Category } from '@/modules/categories/schema/category.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VideoDocument = HydratedDocument<Video>;

@Schema({ timestamps: true })
export class Video {
    // Thông tin liên quan đến người dùng
    @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Thêm trường userId tham chiếu tới User
    userId: Types.ObjectId;

    // Thông tin cơ bản về video
    @Prop({ required: true })
    title: string;


    @Prop({ type: Types.ObjectId, ref: Category.name })
    category: Types.ObjectId;

    @Prop({
        type: String,
        enum: ['movie', 'series'],
        required: true
    })
    type_movie: string;

    @Prop()
    poster: string;

    // Trạng thái của video
    @Prop({
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0
    })
    status: number;

    // Thông tin về kích thước và URL
    @Prop({ type: Number })
    size: number;

    @Prop()
    m3u8_url: string;

    @Prop()
    embed_url: string;

    @Prop()
    dropbox_url: string;

    // Thông tin về quyền riêng tư và thống kê
    @Prop({ default: false })
    isPublic: boolean;

    @Prop({ type: Number })
    duration: number;

    @Prop({ type: Number, default: 0 })
    views: number;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
