import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  // تنظیمات ذخیره‌سازی فایل‌ها
  storage(folder: string) {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, `../../uploads/${folder}`);
        cb(null, uploadPath); // مسیر ذخیره‌سازی فایل‌ها
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = file.mimetype.split('/')[1];
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
      },
    });
  }
}
