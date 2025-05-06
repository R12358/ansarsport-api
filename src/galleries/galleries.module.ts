import { Module } from '@nestjs/common';
import { GalleriesController } from './galleries.controller';
import { GalleriesService } from './galleries.service';
import { GalleryRepository } from './repository/gallery.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Module({
  controllers: [GalleriesController],
  providers: [
    GalleriesService,
    GalleryRepository,
    PrismaService,
    FileUploadService,
  ],
})
export class GalleriesModule {}
