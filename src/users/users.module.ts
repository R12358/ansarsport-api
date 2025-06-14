import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { HashService } from 'src/common/hash/hash.service';

@Module({
  imports: [FileUploadModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, PrismaService, HashService],
  exports: [UsersService],
})
export class UsersModule {}
