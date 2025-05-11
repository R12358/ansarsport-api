import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import TeamRepository from './repository/team.respository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, FileUploadService, TeamRepository, PrismaService],
})
export class TeamsModule {}
