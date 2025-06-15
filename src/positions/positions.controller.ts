import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  
} from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { PositionsService } from './positions.service';
import { UpdatePositionDto } from './dto/update-position.dto';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionService: PositionsService) {}

  @Post()
  async create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionService.create(createPositionDto);
  }

  @Get()
  async findAll() {
    return this.positionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.positionService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionService.update(id, updatePositionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.positionService.remove(id);
  }
}
