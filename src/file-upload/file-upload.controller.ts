import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('slider')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: new FileUploadService().getMulterStorage('sliders'),
    }),
  )
  uploadSliderImage(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.fileUploadService.generateFilePath(
      'sliders',
      file.filename,
    );
    return {
      message: 'Slider image uploaded successfully',
      filePath,
    };
  }

  @Post('team')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: new FileUploadService().getMulterStorage('team'),
    }),
  )
  uploadTeamImage(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.fileUploadService.generateFilePath(
      'team',
      file.filename,
    );
    return {
      message: 'Team image uploaded successfully',
      filePath,
    };
  }

  @Post('news')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: new FileUploadService().getMulterStorage('news'),
    }),
  )
  uploadNewsImage(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.fileUploadService.generateFilePath(
      'news',
      file.filename,
    );
    return {
      message: 'News image uploaded successfully',
      filePath,
    };
  }

  @Post('gallery')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: new FileUploadService().getMulterStorage('gallery'),
    }),
  )
  uploadGalleryImage(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.fileUploadService.generateFilePath(
      'gallery',
      file.filename,
    );
    return {
      message: 'Gallery image uploaded successfully',
      filePath,
    };
  }
}
