import { BadRequestException, Inject, Injectable, NotFoundException, Type } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from './schemas/video.schemas';
import mongoose, { Model, Types } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { v4 as uuidv4 } from 'uuid';
import aqp from 'api-query-params';
import { User } from '../users/schemas/user.schema';
import { Dropbox } from 'dropbox';
import { Request, Response } from 'express';

import axios from 'axios';
import { DropboxManageService } from '../dropbox-manage/dropbox-manage.service';

@Injectable()
export class VideosService {
  private dropbox: Dropbox;

  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(User.name) private userModel: Model<User>,
    private categoriesService: CategoriesService,
    private dropboxManageService: DropboxManageService,
  ) {
  }

  async getVideoInfoByUUID(uuid: string): Promise<any> {
    console.log('Fetching video with UUID:', uuid);
    const videoInfo = await this.videoModel.findOne({ embed: { $regex: uuid } }).exec();
    if (videoInfo) {
      videoInfo.encodedUrl = decodeURIComponent(videoInfo.embed);
    }
    return videoInfo;
  }

  async create(
    createVideoDto: CreateVideoDto,
    userId: Types.ObjectId,

  ): Promise<{ video: Video; user: any }> {
    let encodedUrl: string;
    if (createVideoDto.category) {
      const category = await this.categoriesService.findOne(createVideoDto.category, userId);
      if (!category) {
        throw new NotFoundException('Category not found or you do not have access to it');
      }
    }

    if (createVideoDto.dropbox_url) {
      const url = new URL(createVideoDto.dropbox_url);
      const pathname = url.pathname.split('/');
      const idVideo = pathname[pathname.length - 2];
      const filename = pathname[pathname.length - 1];
      const rlkey = url.searchParams.get('rlkey');
      const st = url.searchParams.get('st');
      encodedUrl = uuidv4();

      createVideoDto.embed = `http://localhost:8080/api/v1/videos/stream/${encodedUrl}`;
      createVideoDto.idVideo = idVideo;
      createVideoDto.filename = filename;
      createVideoDto.rlkey = rlkey;
      createVideoDto.st = st;

      try {
        // Use DropboxManageService to get metadata
        const metadata = await this.dropboxManageService.getFileMetadata(`/${filename}`);
        if (metadata && 'size' in metadata) {
          createVideoDto.size = metadata.size;
        }
        if (metadata && 'media_info' in metadata) {
          const mediaInfo = metadata.media_info;
          if (mediaInfo && mediaInfo['.tag'] === 'metadata' && 'metadata' in mediaInfo) {
            const videoMetadata = mediaInfo.metadata;
            if ('dimensions' in videoMetadata) {
              createVideoDto.resolution = `${videoMetadata.dimensions.width}x${videoMetadata.dimensions.height}`;
            }
            if ('duration' in videoMetadata) {
              createVideoDto.duration = Math.round(videoMetadata.duration);
            }
          }
        }

        if (!createVideoDto.title && 'name' in metadata) {
          createVideoDto.title = metadata.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        }
      } catch (error) {
        console.error('Error fetching video metadata from Dropbox:', error);
      }
    }

    const video = new this.videoModel({
      ...createVideoDto,
      userId,
      uuid: encodedUrl,
    });

    const savedVideo = await video.save();
    const user = await this.userModel.findById(userId).select('email name role');

    return {
      video: savedVideo,
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
        role: user.role
      }
    };
  }

  async findAllVideos(): Promise<{ videos: Video[] }> {
    try {
      const videos = await this.videoModel.find().populate('userId', 'email role').exec();

      const transformedVideos = videos.map(video => {
        const videoObj = video.toObject();
        return {
          ...videoObj,
          userId: undefined,
          user: {
            _id: (videoObj.userId as any)._id,
            email: (videoObj.userId as any).email,
            role: (videoObj.userId as any).role
          }
        };
      });

      return {
        videos: transformedVideos as unknown as Video[]
      };
    } catch (error) {
      throw new Error(`Failed to fetch videos: ${error.message}`);
    }
  }

  async findAll(query: string, current: number, pageSize: number, userId: Types.ObjectId) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    filter['userId'] = userId;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.videoModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);
    const videos = await this.videoModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);

    const user = await this.userModel.findById(userId).select('email name role');

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems
      },
      results: videos,
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
        role: user.role
      }
    }
  }

  async findOne(id: Types.ObjectId, userId: Types.ObjectId): Promise<{ video: Video; user: any }> {
    const video = await this.videoModel.findOne({ _id: id, userId }).exec();
    if (!video) {
      throw new NotFoundException('Video not found or you do not have access to it');
    }
    const user = await this.userModel.findById(userId).select('email name role');
    return {
      video,
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
        role: user.role
      }
    };
  }

  async update(
    updateVideoDto: UpdateVideoDto,
    userId: Types.ObjectId
  ): Promise<{ video: Video; user: any }> {
    const video = await this.videoModel.findOne({
      _id: updateVideoDto._id,
      userId
    });

    if (!video) {
      throw new NotFoundException('Video not found or you do not have access to it');
    }

    const updatedVideo = await this.videoModel.findByIdAndUpdate(
      updateVideoDto._id,
      { ...updateVideoDto },
      { new: true }
    );

    const user = await this.userModel.findById(userId).select('email name role');

    return {
      video: updatedVideo,
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
        role: user.role
      }
    };
  }

  async remove(_id: string, userId: Types.ObjectId): Promise<{ message: string; user: any }> {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException("Id is not in correct mongodb format");
    }
    const video = await this.videoModel.findOne({
      _id,
      userId
    });
    if (!video) {
      throw new Error('You do not have permission to delete this video');
    }
    await this.videoModel.deleteOne({ _id });

    const user = await this.userModel.findById(userId).select('email name role');

    return {
      message: 'Video deleted successfully',
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
        role: user.role
      }
    };
  }
}
