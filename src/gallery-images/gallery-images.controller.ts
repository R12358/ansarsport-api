import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { GalleryImagesService } from './gallery-images.service';
import { GalleryImage } from '@prisma/client';
import { CreateGalleryImageDto } from './dto/createGalleryImageDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UpdateGalleryImageDto } from './dto/updateGalleryImageDto';
import * as path from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('gallery-images')
export class GalleryImagesController {
  constructor(
    private readonly service: GalleryImagesService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ galleryImages: GalleryImage[]; totalPages: number }> {
    return this.service.findAllPaginated({
      search,
      page: +page,
      limit: +limit,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<GalleryImage> {
    return this.service.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAllGalleryImages() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads/gallery-images',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createGalleryImageDto: CreateGalleryImageDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imageUrl = image
      ? this.fileUploadService.generateFilePath(
          'gallery-images',
          image.filename,
        )
      : null;

    const galleryImage = await this.service.create({
      ...createGalleryImageDto,
      imageUrl,
    });

    return galleryImage;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads/gallery-images',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGalleryImageDto: UpdateGalleryImageDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const galleryImage = await this.service.findOne(id);

    if (image && galleryImage.imageUrl) {
      const filename = path.basename(galleryImage.imageUrl); // فقط نام فایل
      await this.fileUploadService.removeFile('gallery-images', filename); // حذف فایل قبلی
    }

    const imageUrl = image
      ? this.fileUploadService.generateFilePath(
          'gallery-images',
          image.filename,
        )
      : undefined;

    const updated = await this.service.update(id, {
      ...updateGalleryImageDto,
      ...(imageUrl && { imageUrl }),
    });
    return updated;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
