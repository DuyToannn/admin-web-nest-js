import { Module } from '@nestjs/common';
import { DropboxManageService } from './dropbox-manage.service';
import { DropboxManageController } from './dropbox-manage.controller';

@Module({
  controllers: [DropboxManageController],
  providers: [DropboxManageService],
})
export class DropboxManageModule {}
