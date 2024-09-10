import { Category } from '@/modules/categories/schema/category.schema';
import { User } from '@/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VideoDocument = HydratedDocument<Video>;

@Schema({ timestamps: true })
export class Video {
    // Thông tin liên quan đến người dùng
    @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Thêm trường userId tham chiếu tới User
    userId: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: User.name }) // Thêm trường user tham chiếu tới User
    user: Types.ObjectId;
    // Thông tin cơ bản về video
    @Prop({ required: false })
    title: string;

    @Prop({ required: true })
    embed: string;

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

    @Prop()
    size: number;

    @Prop()
    resolution: string;

    @Prop()
    duration: number;

    @Prop()
    dropbox_url: string;

    @Prop({ default: false })
    isPublic: boolean;

    @Prop()
    encodedUrl?: string;

    @Prop()
    uuid?: string;

    @Prop()
    idVideo?: string;

    @Prop()
    filename?: string;

    @Prop()
    rlkey?: string;

    @Prop()
    st?: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
