import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { GalleriesService } from './galleries.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import * as path from 'path';

@Controller('galleries')
export class GalleriesController {
  constructor(
    private readonly galleryService: GalleriesService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('coverImageUrl', {
      storage: diskStorage({
        destination: './uploads/gallery',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const coverImageUrl = image
      ? this.fileUploadService.generateFilePath('gallery', image.filename)
      : null;

    const gallery = await this.galleryService.create({
      ...createGalleryDto,
      coverImageUrl,
    });

    return gallery;
  }

  @Get()
  async findAll() {
    return this.galleryService.findAll();
  }

  @Get(':id')
  async findOne(id: number) {
    return this.galleryService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('coverImageUrl', {
      storage: diskStorage({
        destination: './uploads/gallery',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGalleryDto: UpdateGalleryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    // مرحله ۱: گرفتن اطلاعات قبلی کاربر
    const gallery = await this.galleryService.findOne(id);

    // مرحله ۲: اگر عکس جدید اومده و قبلاً عکس داشت، حذفش کن
    if (image && gallery.coverImageUrl) {
      const filename = path.basename(gallery.coverImageUrl); // فقط نام فایل
      await this.fileUploadService.removeFile('gallery', filename); // حذف فایل قبلی
    }

    // مرحله ۳: تولید آدرس جدید
    const coverImageUrl = image
      ? this.fileUploadService.generateFilePath('gallery', image.filename)
      : undefined;

    // مرحله ۴: ذخیره اطلاعات جدید
    const updated = await this.galleryService.update(id, {
      ...updateGalleryDto,
      ...(coverImageUrl && { coverImageUrl }),
    });
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.galleryService.remove(id);
  }
}
