import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';

@Injectable()
export default class TeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) {
    return this.prisma.team.create({ data: createTeamDto });
  }

  async findAll() {
    return this.prisma.team.findMany();
  }

  async findUnique(id: number) {
    return this.prisma.team.findUnique({ where: { id } });
  }

  async findFirst(id: number) {
    return this.prisma.team.findFirst({ where: { id } });
  }

  async usedInMatch(id: number) {
    return this.prisma.match.findFirst({
      where: {
        OR: [{ homeTeamId: id }, { awayTeamId: id }],
      },
    });
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    return this.prisma.team.update({
      where: { id },
      data: { ...updateTeamDto },
    });
  }

  async remove(id: number) {
    return this.prisma.team.delete({ where: { id } });
  }
}
