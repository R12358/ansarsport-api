import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsRepository } from './repository/tags.repository';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly repo: TagsRepository) {}
  async create(createTagDto: CreateTagDto) {
    return this.repo.create(createTagDto);
  }

  async findOne(id: number) {
    return this.repo.findOne(id);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    return this.repo.update(id, updateTagDto);
  }

  async remove(id: number) {
    return this.repo.remove(id);
  }
}
