import { UseGuards, Controller, Get, Post, Query, Body, Patch, Param, Delete, Req, NotFoundException, Put, HttpException, HttpStatus, Res } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Public, Roles } from '@/decorator/customize';
import { Video } from './schemas/video.schemas';
import { Request, Response } from 'express';
import { UserDocument } from '../users/schemas/user.schema';
import { RolesGuard } from '@/auth/passport/roles.guard';
import { Types } from 'mongoose';
import axios from 'axios';
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) { }

  @Get('all')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async findAllVideos(@Req() req: Request): Promise<{ videos: Video[] }> {
    return this.videosService.findAllVideos();
  }

  @Get()
  findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Req() req: Request
  ) {
    const user = req.user as UserDocument;
    const userId = user._id;
    return this.videosService.findAll(query, +current, +pageSize, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request): Promise<{ video: Video; user: any }> {
    const user = req.user as UserDocument;
    const userId = user._id;
    const videoId = new Types.ObjectId(id);
    const video = await this.videosService.findOne(videoId, userId);
    if (!video) {
      throw new NotFoundException('Category not found or you do not have access to it');
    }
    return video;
  }


  @Post()
  async create(@Body() createVideoDto: CreateVideoDto, @Req() req: Request,): Promise<{ video: Video; user: any }> {
    const user = req.user as UserDocument;
    const userId = user._id;
    return this.videosService.create(createVideoDto, userId);
  }


  @Put()
  async update(@Body() updateVideoDto: UpdateVideoDto, @Req() req: Request) {
    const user = req.user as UserDocument;
    const userId = user._id;
    return this.videosService.update(updateVideoDto, userId)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as UserDocument;
    const userId = user._id;
    return this.videosService.remove(id, userId);
  }

  @Public()
  @Get('stream/:uuid')
  async streamVideoByUUID(
    @Param('uuid') uuid: string,
    @Res() res: Response
  ) {
    const videoInfo = await this.videosService.getVideoInfoByUUID(uuid);
    if (!videoInfo) {
      throw new HttpException('Video not found.', HttpStatus.NOT_FOUND);
    }

    const { idVideo, filename, rlkey, st } = videoInfo;
    const dropboxLink = `https://www.dropbox.com/scl/fi/${idVideo}/${filename}?rlkey=${rlkey}&st=${st}&raw=1`;
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    try {
      const response = await axios({
        url: dropboxLink,
        method: 'GET',
        responseType: 'stream',
        headers: { 'Accept': 'video/mp4' },
      });

      response.data.pipe(res);
    } catch (error) {
      console.error('Error fetching video:', error.message);
      throw new HttpException('Error streaming video.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
