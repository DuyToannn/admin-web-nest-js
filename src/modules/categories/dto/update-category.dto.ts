import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsMongoId({ message: "ID not Valid" })
    @IsNotEmpty({ message: "Id is not empty" })
    _id: string;

    @IsOptional()
    name: string;

    @IsOptional()
    description: string;
    
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
