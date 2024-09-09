import { Injectable } from '@nestjs/common';
import { CreateVideoManagementDto } from './dto/create-video-management.dto';
import { UpdateVideoManagementDto } from './dto/update-video-management.dto';
import { InjectModel } from '@nestjs/mongoose';
import { VideoManagement } from './entities/video-management.schemas';
import { Model, Types } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class VideoManagementService {

  constructor(
    @InjectModel(VideoManagement.name) private readonly videoManagementModel: Model<VideoManagement>,
  ) { }

  private extractUrlParts(url: string) {
    try {
      const urlParts = new URL(url);
      const pathname = urlParts.pathname.split('/');
      const filename = pathname.pop();
      const idVideo = pathname.pop() || '';
      const searchParams = new URLSearchParams(urlParts.search);
      const rlkey = searchParams.get('rlkey') || '';
      const st = searchParams.get('st') || '';

      return { idVideo, filename, rlkey, st };
    } catch (error) {
      throw new Error('Invalid URL format');
    }
  }

  async create(url: string, userId: Types.ObjectId): Promise<VideoManagement> {
    const { idVideo, filename, rlkey, st } = this.extractUrlParts(url);
    const fullUrl = `http://localhost:8080/api/v1/video-management/stream/${idVideo}?filename=${filename}&rlkey=${rlkey}&st=${st}`;

    const videoManagement = new this.videoManagementModel({
      idVideo,
      filename,
      rlkey,
      st,
      fullUrl,
      userId
    });

    return videoManagement.save();
  }
  async getVideoInfoByUUID(uuid: string): Promise<any> {
    // Tìm thông tin video dựa trên UUID
    const videoInfo = await this.videoManagementModel.findOne({ uuid }).exec(); // Giả sử bạn đã lưu UUID trong cơ sở dữ liệu
    return videoInfo;
  }

  async findAllVideos(): Promise<VideoManagement[]> {
    try {
      // Trả về tất cả video
      return await this.videoManagementModel.find().exec();
    } catch (error) {
      throw new Error(`Failed to fetch all videos: ${error.message}`);
    }
  }
  async findAllVideosByUser(query: string, current: number, pageSize: number, userId: Types.ObjectId) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    filter['userId'] = userId;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.videoManagementModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize);
    const results = await this.videoManagementModel
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
}
