import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateVideoDto {


    @IsString()
    title: string;


    @IsOptional()
    @IsString()
    poster?: string;

    @IsOptional()
    @IsString()
    status?: number;

    @IsOptional()
    size?: number;

    @IsOptional()
    @IsString()
    m3u8_url?: string;

    @IsOptional()
    @IsString()
    embed_url?: string;

    @IsOptional()
    @IsString()
    dropbox_url?: string;

    @IsOptional()
    isPublic?: boolean;

    @IsOptional()
    duration?: number;

    @IsOptional()
    views?: number;

    @IsOptional()
    @IsMongoId()
    category?: Types.ObjectId;
    @IsString()
    @IsEnum(['movie', 'series'])
    type_movie?: 'movie' | 'series';
}
