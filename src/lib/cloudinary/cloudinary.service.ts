import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import path from 'path';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>(ENVEnum.CLOUDINARY_CLOUD_NAME),
      api_key: this.configService.get<string>(ENVEnum.CLOUDINARY_API_KEY),
      api_secret: this.configService.get<string>(ENVEnum.CLOUDINARY_API_SECRET),
    });
  }

  async uploadImageFromBuffer(
    fileBuffer: Buffer,
    filename: string,
    folder = 'profile-images',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const originalNameWithoutExt = path.parse(filename).name;

      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: originalNameWithoutExt,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        },
      );
      Readable.from(fileBuffer).pipe(stream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
