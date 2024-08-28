import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from './schemas/video.schemas';
import { Model, Types } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { getUidFromUrl } from '@/helpers/utils';
import aqp from 'api-query-params';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    private categoriesService: CategoriesService,
    private cloudinaryService: CloudinaryService
  ) { }
  async create(createVideoDto: CreateVideoDto, userId: Types.ObjectId, file?: Express.Multer.File): Promise<Video> {
    if (createVideoDto.category) {
      const category = await this.categoriesService.findOne(createVideoDto.category);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }
    if (createVideoDto.drive_url) {
      const uid = getUidFromUrl(createVideoDto.drive_url);
      if (!uid) {
        throw new Error('Invalid Google Drive URL');
      }
      createVideoDto.uid = uid;
    }

    let posterUrl: string | undefined;
    if (file) {
      const uploadResponse = await this.cloudinaryService.uploadImage(file);
      posterUrl = uploadResponse.secure_url;
    }


    const video = new this.videoModel({
      ...createVideoDto,
      userId,
      poster: posterUrl,
    });
    return video.save();

  }



  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

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

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
