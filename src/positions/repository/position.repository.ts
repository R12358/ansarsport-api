import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { Injectable, ConflictException } from '@nestjs/common';

@Injectable()
export class PositionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPositionDto: CreatePositionDto) {
    const exists = await this.prisma.position.findUnique({
      where: { title: createPositionDto.title },
    });

    if (exists) {
      throw new ConflictException('سمتی با این عنوان قبلاً ثبت شده است.');
    }

    return await this.prisma.position.create({
      data: createPositionDto,
    });
  }

  async findAll() {
    return this.prisma.position.findMany();
  }

  async findOne(id: number) {
    return this.prisma.position.findFirst({ where: { id } });
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const position = await this.prisma.position.update({
      where: { id },
      data: updatePositionDto,
    });

    return position;
  }

  async remove(id: number) {
    const membersCount = await this.prisma.member.count({
      where: { positionId: id },
    });

    if (membersCount > 0) {
      throw new ConflictException(
        'برای این سمت، عضو(هایی) ثبت شده‌اند و قابل حذف نیست.',
      );
    }

    return this.prisma.position.delete({
      where: { id },
    });
  }
}
