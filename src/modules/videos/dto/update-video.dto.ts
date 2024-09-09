import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from './create-video.dto';
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
    @IsMongoId()
    @IsOptional()
    _id?: string;

    
    @IsOptional()
    title?: string;

    @IsOptional()
    embed?: string;
    @IsOptional()
    @IsMongoId()
    category?: Types.ObjectId;

    @IsEnum(['movie', 'series'])
    @IsOptional()
    type_movie?: 'movie' | 'series';

    
    @IsOptional()
    poster?: string;

    
    
    @IsOptional()
    dropbox_url?: string;

    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;

}
