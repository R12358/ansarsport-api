import { Module } from '@nestjs/common';
import { GalleryImagesController } from './gallery-images.controller';
import { GalleryImagesService } from './gallery-images.service';
import { GalleryImageRepository } from './repository/gallery-images.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Module({
  controllers: [GalleryImagesController],
  providers: [
    GalleryImagesService,
    GalleryImageRepository,
    PrismaService,
    FileUploadService,
  ],
})
export class GalleryImagesModule {}
