import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { VideosRepository } from './repository/videos.repository';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideosService {
  constructor(private readonly repo: VideosRepository) {}
  async create(createVideoDto: CreateVideoDto) {
    return this.repo.create(createVideoDto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    const currentVideo = this.findOrFail(id);
    return this.repo.findOne(id);
  }

  private async findOrFail(id: number) {
    const video = await this.repo.findOne(id);
    if (!video) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `ویدیو با شناسه ${id} یافت نشد`,
          error: 'Video Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto) {
    const currentVideo = this.findOrFail(id);

    return this.repo.update(id, updateVideoDto);
  }

  async remove(id: number) {
    const video = this.findOrFail(id);
    return this.repo.remove(id);
  }
}
