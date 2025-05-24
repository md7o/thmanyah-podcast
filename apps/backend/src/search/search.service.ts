import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Podcast } from './entities/podcast.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Podcast)
    private podcastRepo: Repository<Podcast>,
  ) {}

  async search(term: string): Promise<Podcast[]> {
    const res = await axios.get(
      `https://itunes.apple.com/search?media=podcast&term=${encodeURIComponent(term)}`,
    );

    const items = res.data.results.map((item) => {
      return this.podcastRepo.create({
        title: item.collectionName,
        image_url: item.artworkUrl600,
        itunes_url: item.collectionViewUrl,
        description: item.description || '',
        publisher: item.artistName || '',
      });
    });

    await this.podcastRepo.clear();

    await this.podcastRepo.save(items);

    return items;
  }
}
