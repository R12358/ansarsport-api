import { Injectable } from '@nestjs/common';
import { CreateSliderDto } from '../dto/create-slider.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSliderDto } from '../dto/update-slider.dto';

@Injectable()
export class SliderRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createSliderDto: CreateSliderDto) {
    return this.prisma.slider.create({
      data: {
        imageUrl: createSliderDto.imageUrl,
        linkUrl: createSliderDto.linkUrl,
        title: createSliderDto.title,
        description: createSliderDto.description,
        order: createSliderDto.order ?? 0,
        isActive: createSliderDto.isActive ?? true,
        publishedAt: createSliderDto.publishedAt
          ? new Date(createSliderDto.publishedAt)
          : new Date(), // یا null یا undefined بسته به نیازت
      },
    });
  }

  async findAll() {
    return this.prisma.slider.findMany({ where: { deletedAt: null } });
  }

  async findOne(id: number) {
    return this.prisma.slider.findUnique({ where: { id } });
  }

  async update(id: number, updateSliderDto: UpdateSliderDto) {
    return this.prisma.slider.update({
      where: { id },
      data: updateSliderDto,
    });
  }

  async remove(id: number) {
    return this.prisma.slider.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
