import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Req } from '@nestjs/common';
import { DropboxManageService } from './dropbox-manage.service';
import { Response, Request } from 'express';
import { Public } from '@/decorator/customize';
@Controller('dropbox-manage')
export class DropboxManageController {
  constructor(private readonly dropboxManageService: DropboxManageService) { }
  @Public()
  @Get('auth')
  async auth(@Res() res: Response) {
    const authUrl = await this.dropboxManageService.getAuthUrl();
    res.redirect(authUrl);
  }

  @Public()
  @Get('callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    const { code } = req.query;
    await this.dropboxManageService.handleCallback(code as string);
    res.redirect('http://localhost:3000/dashboard/dropbox');
  }
  @Public()
  @Get('status')
  async status() {
    return this.dropboxManageService.getLoginStatus();
  }
  @Public()
  @Get('space-usage')
  async spaceUsage() {
    return this.dropboxManageService.getSpaceUsage();
  }
  @Public()
  @Get('account-info')
  async getAccountInfo() {
    return this.dropboxManageService.getAccountInfo();
  }
  @Public()
  @Post('logout')
  async logout(@Req() req, @Res() res) {
    try {
      await this.dropboxManageService.logout(req);
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Logout failed', error });
    }
  }
}
