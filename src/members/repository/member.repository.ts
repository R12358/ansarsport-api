import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { Member } from '@prisma/client';
import { UpdateMemberDto } from '../dto/update-member.dto';

@Injectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMemberDto) {
    return await this.prisma.member.create({
      data: {
        jerseyNumber: dto.jerseyNumber,
        ageGroup: dto.ageGroup,
        user: { connect: { id: dto.userId } },
        position: dto.position,
      },
    });
  }

  async findById(id: number): Promise<Member | null> {
    return this.prisma.member.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.member.findUnique({
      where: { userId },
    });
  }

  async findAll() {
    return this.prisma.member.findMany({
      where: { deletedAt: null },
      include: { user: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.member.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: { user: true },
    });
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const member = await this.prisma.member.update({
      where: { id },
      data: updateMemberDto,
    });

    return member;
  }

  async remove(id: number) {
    return this.prisma.member.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
