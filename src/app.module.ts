import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MembersModule } from './members/members.module';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [UsersModule, FileUploadModule, MembersModule, PositionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
