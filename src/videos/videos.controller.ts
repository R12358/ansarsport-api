import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UpdateVideoDto } from './dto/update-video.dto';
import * as path from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('videos')
export class VideosController {
  constructor(
    private readonly videoService: VideosService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnailUrl', {
      storage: diskStorage({
        destination: './uploads/videos/thumbnai',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const thumbnailUrl = image
      ? this.fileUploadService.generateFilePath(
          'videos/thumbnai',
          image.filename,
        )
      : null;

    const video = await this.videoService.create({
      ...createVideoDto,
      thumbnailUrl,
    });

    return video;
  }

  @Get()
  async findAll() {
    return this.videoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.videoService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('thumbnailUrl', {
      storage: diskStorage({
        destination: './uploads/videos/thumbnai',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() updateVideoDto: UpdateVideoDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    // مرحله ۱: گرفتن اطلاعات قبلی کاربر
    const currentVideo = await this.videoService.findOne(id);

    // مرحله ۲: اگر عکس جدید اومده و قبلاً عکس داشت، حذفش کن
    if (image && currentVideo.thumbnailUrl) {
      const filename = path.basename(currentVideo.thumbnailUrl); // فقط نام فایل
      await this.fileUploadService.removeFile('videos/thumbnai', filename); // حذف فایل قبلی
    }

    const thumbnailUrl = image
      ? this.fileUploadService.generateFilePath(
          'videos/thumbnai',
          image.filename,
        )
      : undefined;

    const video = await this.videoService.update(id, {
      ...updateVideoDto,
      ...(thumbnailUrl && { thumbnailUrl }),
    });

    return video;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.videoService.remove(id);
  }
}
