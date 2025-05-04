import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TagsRepository } from './repository/tags.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, TagsRepository, PrismaService],
})
export class TagsModule {}
