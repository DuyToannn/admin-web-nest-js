import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}
