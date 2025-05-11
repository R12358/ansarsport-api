import { Injectable } from '@nestjs/common';
import TeamRepository from './repository/team.respository';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly repo: TeamRepository) {}

  async create(createTeamDto: CreateTeamDto) {
    return this.repo.create(createTeamDto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    return this.repo.findOne(id);
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    return this.repo.update(id, updateTeamDto);
  }

  async remove(id: number) {
    return this.repo.remove(id);
  }
}
