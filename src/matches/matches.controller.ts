import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match, MatchType } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchService: MatchesService) {}

  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    Logger.log(`📥 Received DTO: ${JSON.stringify(createMatchDto)}`);
    return this.matchService.create(createMatchDto);
  }

  @Get('highlighted')
  async getHighlightedMatches() {
    const upcoming = await this.matchService.findMatchByType(
      MatchType.PREVIOUS,
    );
    const previous = await this.matchService.findMatchByType(
      MatchType.UPCOMING,
    );

    return { previous, upcoming };
  }

  @Get('previous')
  async getPreviousMatch() {
    return this.matchService.findMatchByType(MatchType.PREVIOUS);
  }

  @Get('upcoming')
  async getUpComingMatch() {
    return this.matchService.findMatchByType(MatchType.UPCOMING);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.matchService.findOne(id);
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ matches: Match[]; totalPages: number }> {
    return this.matchService.findAllPaginated({
      search,
      page: +page,
      limit: +limit,
    });
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
