import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { VideoManagementService } from './video-management.service';
import { Public, Roles } from '@/decorator/customize';
import { Request, Response } from 'express';
import axios from 'axios';
import { UserDocument } from '../users/schemas/user.schema';
import { VideoManagement } from './entities/video-management.schemas';
import { RolesGuard } from '@/auth/passport/roles.guard';

@Controller('video-management')
export class VideoManagementController {
  constructor(private readonly videoManagementService: VideoManagementService) { }

  @Public()
  @Get('stream/:fileId')
  async streamVideo(
    @Param('fileId') fileId: string,
    @Query('filename') filename: string,
    @Query('rlkey') rlkey: string,
    @Query('st') st: string,
    @Res() res: Response
  ) {
    const dropboxLink = `https://www.dropbox.com/scl/fi/${fileId}/${filename}?rlkey=${rlkey}&st=${st}&raw=1`;
    try {
      const response = await axios({
        url: dropboxLink,
        method: 'GET',
        responseType: 'stream',
        headers: { 'Accept': 'video/mp4' },
      });

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

      response.data.pipe(res);
    } catch (error) {
      console.error('Error fetching video:', error.message);
      throw new HttpException('Error streaming video.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() body: any, @Req() req: Request): Promise<VideoManagement> {
    const { url } = body;
    const user = req.user as UserDocument;
    const userId = user._id;
    return this.videoManagementService.create(url, userId);

  }
  @Get('all')
  @Roles('admin') // Optional: chỉ cho phép admin xem tất cả video
  @UseGuards(RolesGuard) // Optional: sử dụng guard để kiểm tra quyền truy cập
  async findAllVideos(): Promise<VideoManagement[]> {
    return this.videoManagementService.findAllVideos(); // Gọi service để lấy tất cả video
  }


  @Get()
  async findAllVideosByUser(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Req() req: Request) {
    const user = req.user as UserDocument;
    const userId = user._id;

    return this.videoManagementService.findAllVideosByUser(query, +current, +pageSize, userId); // Gọi service để lấy video theo userId
  }
}
