import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MembersModule } from './members/members.module';
import { PositionsModule } from './positions/positions.module';
import { NewsModule } from './news/news.module';
import { TagsModule } from './tags/tags.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [UsersModule, FileUploadModule, MembersModule, PositionsModule, NewsModule, TagsModule, VideosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
