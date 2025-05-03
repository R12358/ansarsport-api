import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PositionRepository } from './repository/position.repository';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(private readonly repo: PositionRepository) {}

  async create(createPositionDto: CreatePositionDto) {
    return this.repo.create(createPositionDto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    const position = await this.findOrFail(id);

    return this.repo.findOne(id);
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const position = this.findOrFail(id);

    return this.repo.update(id, updatePositionDto);
  }

  async remove(id: number) {
    const position = this.findOrFail(id);
    return this.repo.remove(id);
  }

  private async findOrFail(id: number) {
    const position = await this.repo.findOne(id);
    if (!position) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `عضو با شناسه ${id} یافت نشد`,
          error: 'Member Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return position;
  }
}
