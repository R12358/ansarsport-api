import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { PositionRepository } from './repository/position.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService, PositionRepository, PrismaService],
})
export class PositionsModule {}
