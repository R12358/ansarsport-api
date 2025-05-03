import {
  Controller,
  Patch,
  Post,
  Body,
  Get,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UpdateUserDto } from './dto/update-user.dto';
import * as path from 'path';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('avatarUrl', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const avatarUrl = image
      ? this.fileUploadService.generateFilePath('users', image.filename)
      : null;

    const user = await this.userService.create({
      ...createUserDto,
      avatarUrl,
    });

    return user;
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('avatarUrl', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    // مرحله ۱: گرفتن اطلاعات قبلی کاربر
    const user = await this.userService.findOne(id);

    // مرحله ۲: اگر عکس جدید اومده و قبلاً عکس داشت، حذفش کن
    if (image && user.avatarUrl) {
      const filename = path.basename(user.avatarUrl); // فقط نام فایل
      await this.fileUploadService.removeFile('users', filename); // حذف فایل قبلی
    }

    // مرحله ۳: تولید آدرس جدید
    const avatarUrl = image
      ? this.fileUploadService.generateFilePath('users', image.filename)
      : undefined;

    // مرحله ۴: ذخیره اطلاعات جدید
    const updated = await this.userService.update(id, {
      ...updateUserDto,
      ...(avatarUrl && { avatarUrl }),
    });
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
