import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';

@Module({
  providers: [FileUploadService, FileUploadService],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
