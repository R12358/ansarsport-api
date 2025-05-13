import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { MatchRepository } from './repository/match.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [MatchesService, MatchRepository, PrismaService],
  controllers: [MatchesController],
})
export class MatchesModule {}
