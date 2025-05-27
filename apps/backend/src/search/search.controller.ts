import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { Podcast } from './entities/podcast.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from './entities/episode.entity';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    @InjectRepository(Podcast)
    private readonly podcastRepo: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodeRepo: Repository<Episode>,
  ) {}

  @Get('refresh')
  async refresh(): Promise<Podcast[]> {
    const podcasts = await this.podcastRepo.find();
    if (podcasts.length === 0) {
      throw new NotFoundException('No podcasts found');
    }
    return this.searchService.refresh(podcasts[0].title);
  }

  @Get()
  async search(
    @Query('term') term: string,
    @Query('id') id: string,
  ): Promise<Podcast[] | Podcast | undefined> {
    if (term) {
      return this.searchService.search(term);
    }

    if (id) {
      const podcast = await this.podcastRepo.findOne({
        where: { id: parseInt(id) },
      });

      if (!podcast) {
        return this.searchService.searchById(parseInt(id));
      }

      return podcast;
    }

    return;
  }

  @Get('by-id')
  async searchById(@Query('id', ParseIntPipe) id: number): Promise<Podcast> {
    const podcast = await this.podcastRepo.findOne({
      where: { id },
    });
    if (!podcast) {
      throw new NotFoundException(`Podcast with id ${id} not found`);
    }
    return podcast;
  }

  @Get('podcast/:id/episodes')
  async getEpisodesByPodcast(@Param('id', ParseIntPipe) id: number) {
    const podcast = await this.podcastRepo.findOne({
      where: { id },
    });

    if (!podcast) {
      throw new NotFoundException(`Podcast with id ${id} not found`);
    }

    return this.episodeRepo.find({
      where: { podcast: { id } },
      order: { pubDate: 'DESC' },
    });
  }
}
