import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchService: MatchesService) {}

  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.matchService.findOne(id);
  }

  @Get()
  async findAll() {
    return this.matchService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchService.update(id, updateMatchDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.matchService.remove(id);
  }
}
