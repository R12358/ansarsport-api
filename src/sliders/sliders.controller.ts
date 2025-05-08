import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UpdateSliderDto } from './dto/update-slider.dto';
import * as path from 'path';

@Controller('sliders')
export class SlidersController {
  constructor(
    private readonly sliderService: SlidersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads/sliders',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createSliderDto: CreateSliderDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const imageUrl = image
      ? this.fileUploadService.generateFilePath('sliders', image.filename)
      : null;

    if (!image) {
      throw new BadRequestException('تصویر الزامی است.');
    }

    const slider = await this.sliderService.create({
      ...createSliderDto,
      imageUrl,
    });

    return slider;
  }

  @Get()
  async findAll() {
    return this.sliderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.sliderService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: diskStorage({
        destination: './uploads/sliders',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() updateSliderDto: UpdateSliderDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    // مرحله ۱: گرفتن اطلاعات قبلی اسلایدر
    const slider = await this.sliderService.findOne(id);

    // مرحله ۲: اگر عکس جدید اومده و قبلاً عکس داشت، حذفش کن
    if (image && slider.imageUrl) {
      const filename = path.basename(slider.imageUrl); // فقط نام فایل
      await this.fileUploadService.removeFile('sliders', filename); // حذف فایل قبلی
    }

    // مرحله ۳: تولید آدرس جدید
    const imageUrl = image
      ? this.fileUploadService.generateFilePath('sliders', image.filename)
      : undefined;

    // مرحله ۴: ذخیره اطلاعات جدید
    const updated = await this.sliderService.update(id, {
      ...updateSliderDto,
      ...(imageUrl && { imageUrl }),
    });
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.sliderService.remove(id);
  }
}
