import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from '@prisma/client';

@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @Post()
  async create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ members: Member[]; totalPages: number }> {
    return this.memberService.findAllPaginated({
      search,
      page: +page,
      limit: +limit,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.memberService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.memberService.update(id, updateMemberDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.memberService.remove(id);
  }
}
