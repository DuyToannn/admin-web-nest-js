import { PartialType } from '@nestjs/mapped-types';
import { CreateDropboxManageDto } from './create-dropbox-manage.dto';

export class UpdateDropboxManageDto extends PartialType(CreateDropboxManageDto) {}
