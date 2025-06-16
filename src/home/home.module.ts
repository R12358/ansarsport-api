import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { NewsModule } from 'src/news/news.module';
import { MatchesModule } from 'src/matches/matches.module';
import { SlidersModule } from 'src/sliders/sliders.module';

@Module({
  imports: [NewsModule, MatchesModule, SlidersModule],
  controllers: [HomeController],
})
export class HomeModule {}
