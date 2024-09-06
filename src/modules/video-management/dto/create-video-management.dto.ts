import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVideoManagementDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}
