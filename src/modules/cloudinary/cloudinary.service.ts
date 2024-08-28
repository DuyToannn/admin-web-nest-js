// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, ConfigOptions, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    this.configureCloudinary();
  }

  private configureCloudinary() {
    const config: ConfigOptions = {
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    };
    cloudinary.config(config);
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(file.path, { folder: 'uploads' });

    return {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    };
  }

}
