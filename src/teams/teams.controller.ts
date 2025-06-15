import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTagDto } from 'src/tags/dto/update-tag.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as path from 'path';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly teamService: TeamsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('logoUrl', {
      storage: diskStorage({
        destination: './uploads/teams',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const logoUrl = image
      ? this.fileUploadService.generateFilePath('teams', image.filename)
      : null;

    const team = await this.teamService.create({
      ...createTeamDto,
      logoUrl,
    });

    return team;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ teams: Team[]; totalPages: number }> {
    return this.teamService.findAllPaginated({
      search,
      page: +page,
      limit: +limit,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAllTeams() {
    return this.teamService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.teamService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('logoUrl', {
      storage: diskStorage({
        destination: './uploads/teams',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() updateTeamDto: UpdateTeamDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    // مرحله ۱: گرفتن اطلاعات قبلی تیم
    const currentTeam = await this.teamService.findOne(id);

    // مرحله ۲: اگر عکس جدید اومده و قبلاً عکس داشت، حذفش کن
    if (image && currentTeam.logoUrl) {
      const filename = path.basename(currentTeam.logoUrl); // فقط نام فایل
      await this.fileUploadService.removeFile('teams', filename); // حذف فایل قبلی
    }

    const logoUrl = image
      ? this.fileUploadService.generateFilePath('teams', image.filename)
      : undefined;

    const team = await this.teamService.update(id, {
      ...updateTeamDto,
      ...(logoUrl && { logoUrl }),
    });

    return team;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.teamService.remove(id);
  }
}
