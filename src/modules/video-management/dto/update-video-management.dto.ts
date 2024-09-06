import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoManagementDto } from './create-video-management.dto';

export class UpdateVideoManagementDto extends PartialType(CreateVideoManagementDto) {}
