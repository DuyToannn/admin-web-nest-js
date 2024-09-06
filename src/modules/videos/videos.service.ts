import { BadRequestException, Inject, Injectable, NotFoundException, Type } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from './schemas/video.schemas';
import mongoose, { Model, Types } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';

import aqp from 'api-query-params';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    private categoriesService: CategoriesService,
    private cloudinaryService: CloudinaryService
  ) { }
  async create(
    createVideoDto: CreateVideoDto,
    userId: Types.ObjectId,
    file?: Express.Multer.File): Promise<Video> {

    if (createVideoDto.category) {
      const category = await this.categoriesService.findOne(createVideoDto.category, userId);
      if (!category) {
        throw new NotFoundException('Category not found or you do not have access to it');
      }
    }


    let posterUrl: string | undefined;
    if (file) {
      try {
        const uploadResponse = await this.cloudinaryService.uploadImage(file);
        posterUrl = uploadResponse.secure_url;
      } catch (error) {
        throw new Error('Failed to upload poster: ' + error.message);
      }
    }

    const video = new this.videoModel({
      ...createVideoDto,
      userId,
      poster: posterUrl,
    });
    return video.save();
  }

  async findAllVideos(): Promise<Video[]> {
    try {
      return await this.videoModel.find().exec();
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
    const results = await this.videoModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);
    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems
      },
      results
    }
  }

  async findOne(id: Types.ObjectId, userId: Types.ObjectId): Promise<Video> {
    const video = await this.videoModel.findOne({ _id: id, userId }).exec();
    if (!video) {
      throw new NotFoundException('Video not found or you do not have access to it');
    }
    return video;
  }

  async update(
    updateVideoDto: UpdateVideoDto,
    userId: Types.ObjectId
  ): Promise<Video> {
    const video = await this.videoModel.findOne({
      _id: updateVideoDto._id,
      userId
    });

    if (!video) {
      throw new NotFoundException('Video not found or you do not have access to it');
    }

    return this.videoModel.findByIdAndUpdate(
      updateVideoDto._id,
      { ...updateVideoDto },
      { new: true }
    );
  }

  async remove(_id: string, userId: Types.ObjectId): Promise<any> {
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
    return this.videoModel.deleteOne({ _id });
  }
}
