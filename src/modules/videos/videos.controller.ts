import { Controller, Get, Post, Query, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Public } from '@/decorator/customize';
import { Video } from './schemas/video.schemas';
import { Request } from 'express';
import {  UserDocument } from '../users/schemas/user.schema';
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) { }

  @Post()
  async create(@Body() createVideoDto: CreateVideoDto, @Req() req: Request): Promise<Video> {
    const user = req.user as UserDocument; 
    const userId = user._id;
    return this.videosService.create(createVideoDto, userId);
  }

  @Get()
  @Public()
  findAll(
    @Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
  ) {
    return this.videosService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(+id);
  }
}
