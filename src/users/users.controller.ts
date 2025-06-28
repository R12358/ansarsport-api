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
  Query,
  UseGuards,
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
import { AgeGroup, User, Position } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MembersService } from 'src/members/members.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly memberService: MembersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ users: User[]; totalPages: number }> {
    return this.userService.findAllPaginated({
      search,
      page: +page,
      limit: +limit,
    });
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
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
      address,
      isActive,
      jerseyNumber,
      ageGroup,
      position,
    } = createUserDto;

    const avatarUrl = image
      ? this.fileUploadService.generateFilePath('users', image.filename)
      : null;

    // فقط فیلدهای مربوط به یوزر
    const user = await this.userService.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      isActive,
      role,
      avatarUrl,
    });

    // اگر نقش MEMBER بود، اطلاعات خاص عضو را هم ذخیره کن
    if (role === 'MEMBER') {
      await this.memberService.create({
        userId: user.id,
        jerseyNumber: jerseyNumber ? +jerseyNumber : null,
        ageGroup: ageGroup as AgeGroup,
        position: position as Position, // فرض بر اینه که position یک آیدی هست
      });
    }

    return user;
  }

  @UseGuards(JwtAuthGuard)
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
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
      address,
      isActive,
      jerseyNumber,
      ageGroup,
      position,
    } = updateUserDto;

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
    const updatedUser = await this.userService.update(id, {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      isActive,
      role,
      avatarUrl,
    });

    // 5. اگر کاربر از نوع MEMBER بود، اطلاعات Member رو هم آپدیت کن یا بساز
    if (updatedUser.role === 'MEMBER') {
      const existingMember = await this.memberService.findByUserId(id);
      if (existingMember) {
        // آپدیت
        await this.memberService.update(existingMember.id, {
          jerseyNumber: +jerseyNumber,
          ageGroup: ageGroup as AgeGroup,
          position: position as Position, // یا مستقیماً اگر enum کردی
        });
      } else {
        // ساخت جدید
        await this.memberService.create({
          userId: id,
          jerseyNumber: +jerseyNumber,
          ageGroup: ageGroup as AgeGroup,
          position: position as Position, // یا مستقیماً اگر enum کردی
        });
      }
    }
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
