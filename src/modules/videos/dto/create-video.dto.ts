import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class CreateVideoDto {


    @IsString()
    title: string;

    @IsString()
    embed: string;

    @IsOptional()
    @IsString()
    poster?: string;


    @IsOptional()
    @IsString()
    dropbox_url?: string;

    @IsOptional()
    isPublic?: boolean;


    @IsOptional()
    size: number;

    @IsOptional()
    @IsString()
    resolution: string;

    @IsOptional()
    duration: number;

    @IsOptional()
    @IsMongoId()
    category?: Types.ObjectId;
    @IsString()
    @IsEnum(['movie', 'series'])
    type_movie?: 'movie' | 'series';

    @IsString()
    @IsOptional()
    idVideo?: string;

    @IsString()
    @IsOptional()
    filename?: string;

    @IsString()
    @IsOptional()
    rlkey?: string;

    @IsString()
    @IsOptional()
    st?: string;

    @IsString()
    @IsOptional()
    uuid?: string;
}
