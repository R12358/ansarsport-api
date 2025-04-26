import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [UsersModule, FileUploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
