import { Module } from '@nestjs/common';
import { SlidersController } from './sliders.controller';
import { SlidersService } from './sliders.service';
import { SliderRepository } from './repository/slider.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Module({
  controllers: [SlidersController],
  providers: [
    SlidersService,
    SliderRepository,
    PrismaService,
    FileUploadService,
  ],
})
export class SlidersModule {}
