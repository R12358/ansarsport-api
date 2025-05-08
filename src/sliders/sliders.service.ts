import { Injectable } from '@nestjs/common';
import { SliderRepository } from './repository/slider.repository';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';

@Injectable()
export class SlidersService {
  constructor(private readonly repo: SliderRepository) {}

  async create(createSliderDto: CreateSliderDto) {
    return this.repo.create(createSliderDto);
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
