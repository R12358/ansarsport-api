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
  ParseIntPipe,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UpdateNewsDto } from './dto/update-news.dto';
import * as path from 'path';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads/news',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imageUrl = image
      ? this.fileUploadService.generateFilePath('news', image.filename)
      : null;

    const news = await this.newsService.create({
      ...createNewsDto,
      imageUrl,
    });

    return news;
  }

  @Get()
  async findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads/news',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    // مرحله ۱: گرفتن اطلاعات قبلی کاربر
    const currentNews = await this.newsService.findOne(id);

    // مرحله ۲: اگر عکس جدید اومده و قبلاً عکس داشت، حذفش کن
    if (image && currentNews.imageUrl) {
      const filename = path.basename(currentNews.imageUrl); // فقط نام فایل
      await this.fileUploadService.removeFile('news', filename); // حذف فایل قبلی
    }

    const imageUrl = image
      ? this.fileUploadService.generateFilePath('news', image.filename)
      : undefined;

    const news = await this.newsService.update(id, {
      ...updateNewsDto,
      ...(imageUrl && { imageUrl }),
    });

    return news;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.newsService.remove(id);
  }
}
