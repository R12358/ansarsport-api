import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('file-upload')
export class FileUploadController {
  // Helper method for generating multer storage
  private static createMulterStorage(folder: string) {
    return diskStorage({
      destination: `./uploads/${folder}`,
      filename: (req, file, callback) => {
        const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
        callback(null, uniqueSuffix);
      },
    });
  }

  @Post('slider')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: FileUploadController.createMulterStorage('sliders'),
    }),
  )
  uploadSliderImage(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Slider image uploaded successfully',
      filePath: `/uploads/sliders/${file.filename}`,
    };
  }

  @Post('team')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: FileUploadController.createMulterStorage('team'),
    }),
  )
  uploadTeamImage(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Team image uploaded successfully',
      filePath: `/uploads/team/${file.filename}`,
    };
  }

  @Post('news')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: FileUploadController.createMulterStorage('news'),
    }),
  )
  uploadNewsImage(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'News image uploaded successfully',
      filePath: `/uploads/news/${file.filename}`,
    };
  }

  @Post('gallery')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: FileUploadController.createMulterStorage('gallery'),
    }),
  )
  uploadGalleryImage(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Gallery image uploaded successfully',
      filePath: `/uploads/gallery/${file.filename}`,
    };
  }
}
