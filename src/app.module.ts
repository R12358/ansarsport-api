import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MembersModule } from './members/members.module';
import { NewsModule } from './news/news.module';
import { TagsModule } from './tags/tags.module';
import { VideosModule } from './videos/videos.module';
import { GalleriesModule } from './galleries/galleries.module';
import { SlidersModule } from './sliders/sliders.module';
import { TeamsModule } from './teams/teams.module';
import { MatchesModule } from './matches/matches.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GalleryImagesModule } from './gallery-images/gallery-images.module';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    FileUploadModule,
    MembersModule,
    NewsModule,
    TagsModule,
    VideosModule,
    GalleriesModule,
    SlidersModule,
    TeamsModule,
    MatchesModule,
    GalleryImagesModule,
    AuthModule,
    HomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
