import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.repo.create(createUserDto);
    return user;
  }
}
