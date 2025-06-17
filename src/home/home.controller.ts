import { Controller, Get } from '@nestjs/common';
import { MatchType } from '@prisma/client';
import { MatchesService } from 'src/matches/matches.service';
import { NewsService } from 'src/news/news.service';
import { SlidersService } from 'src/sliders/sliders.service';

@Controller('home')
export class HomeController {
  constructor(
    private newsService: NewsService,
    private matchesService: MatchesService,
    private sliderService: SlidersService,
  ) {}

  @Get()
  async getHomeData() {
    const previousMatch = await this.matchesService.findMatchByType(
      MatchType.PREVIOUS,
    );
    const upComingMatch = await this.matchesService.findMatchByType(
      MatchType.UPCOMING,
    );

    const [news, sliders] = await Promise.all([
      this.newsService.findAll(),
      this.sliderService.findAll(),
    ]);

    return {
      news: news,
      sliders: sliders,
      highlightedMatches: {
        previous: previousMatch,
        upcoming: upComingMatch,
      },
    };
  }
}
