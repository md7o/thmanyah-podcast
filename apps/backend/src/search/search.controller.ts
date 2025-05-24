import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Podcast } from './entities/podcast.entity';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query('term') term: string): Promise<Podcast[]> {
    return this.searchService.search(term);
  }
}
