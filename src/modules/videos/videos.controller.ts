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
  async findAllVideos(@Req() req: Request): Promise<Video[]> {
    const user = req.user as UserDocument;
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
  async findOne(@Param('id') id: string, @Req() req: Request): Promise<Video> {
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
  async create(@Body() createVideoDto: CreateVideoDto, @Req() req: Request): Promise<Video> {
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



}
