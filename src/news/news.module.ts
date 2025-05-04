import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsRepository } from './repository/news.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [FileUploadModule],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository, PrismaService],
})
export class NewsModule {}
