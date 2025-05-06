import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { VideosRepository } from './repository/videos.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Module({
  imports: [],
  controllers: [VideosController],
  providers: [
    VideosService,
    VideosRepository,
    PrismaService,
    FileUploadService,
  ],
})
export class VideosModule {}
