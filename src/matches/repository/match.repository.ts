import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchDto } from '../dto/update-match.dto';
import { Injectable } from '@nestjs/common';
import { MatchType } from '@prisma/client';

@Injectable()
export class MatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMatchByType(matchType: MatchType) {
    return this.prisma.match.findFirst({
      where: {
        matchType,
      },
      include: {
        awayTeam: true,
        homeTeam: true,
      },
      orderBy: {
        id: 'desc', // یا createdAt: 'desc' اگر دارید
      },
    });
  }

  async create(createMatchDto: CreateMatchDto) {
    return this.prisma.match.create({
      data: createMatchDto,
    });
  }

  async findAll() {
    return this.prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.match.findUnique({
      where: { id },
      include: { homeTeam: true, awayTeam: true },
    });
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    return this.prisma.match.update({ where: { id }, data: updateMatchDto });
  }
  async remove(id: number) {
    return this.prisma.match.delete({ where: { id } });
  }
}
