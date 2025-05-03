import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

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

  getMulterStorage(folder: string) {
    return diskStorage({
      destination: `./uploads/${folder}`,
      filename: (req, file, callback) => {
        const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
        callback(null, uniqueSuffix);
      },
    });
  }

  generateFilePath(folder: string, filename: string) {
    return `/uploads/${folder}/${filename}`;
  }

  async removeFile(folder: string, filename: string): Promise<void> {
    const filePath = path.join(__dirname, `../../uploads/${folder}`, filename);

    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
        console.log(`File ${filename} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting file ${filename}:`, error);
      }
    } else {
      console.warn(`File ${filename} not found in folder ${folder}.`);
      // فقط هشدار بده، نه throw
      // throw new Error('فایل یافت نشد.'); ← این خط رو حذف کن یا کامنت بذار
    }
  }
}
