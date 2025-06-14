import { Injectable } from '@nestjs/common';
import { SliderRepository } from './repository/slider.repository';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { Slider } from '@prisma/client';

interface FindPaginatedOptions {
  search?: string;
  page: number;
  limit: number;
}

@Injectable()
export class SlidersService {
  constructor(private readonly repo: SliderRepository) {}

  async create(createSliderDto: CreateSliderDto) {
    return this.repo.create(createSliderDto);
  }

  async findAllPaginated(
    options: FindPaginatedOptions,
  ): Promise<{ sliders: Slider[]; totalPages: number; totalCount: number }> {
    const { search = '', page = 1, limit = 10 } = options;
    const allSliders = await this.repo.findAll();

    // فیلتر بر اساس سرچ
    const filtered = allSliders.filter((team) =>
      `${team.id}`.toLowerCase().includes(search.toLowerCase()),
    );

    const total = filtered.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1); // حداقل یک صفحه

    // جلوگیری از صفحه اشتباه
    const safePage = Math.min(Math.max(page, 1), totalPages);

    // برش داده برای صفحه فعلی
    const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

    return {
      sliders: paginated,
      totalPages,
      totalCount: filtered.length,
    };
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    return this.repo.findOne(id);
  }

  async update(id: number, updateSliderDto: UpdateSliderDto) {
    return this.repo.update(id, updateSliderDto);
  }

  async remove(id: number) {
    return this.repo.remove(id);
  }
}
