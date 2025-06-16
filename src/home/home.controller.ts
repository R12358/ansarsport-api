import { Controller, Get } from '@nestjs/common';
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
    const [news, matches, sliders] = await Promise.all([
      this.newsService.findAll(),
      this.matchesService.findAll(),
      this.sliderService.findAll(),
    ]);

    return [news, matches, sliders];
  }
}
