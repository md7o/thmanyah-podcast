import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Podcast } from './entities/podcast.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as xml2js from 'xml2js';
import { Episode } from './entities/episode.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Podcast)
    private podcastRepo: Repository<Podcast>,
    @InjectRepository(Episode)
    private episodeRepo: Repository<Episode>,
  ) {}

  async refresh(term: string): Promise<any> {
    const podcasts = await axios.get(
      `https://itunes.apple.com/search?media=podcast&term=${encodeURIComponent(term)}`,
    );

    const podcastsItems = podcasts.data.results.map((item: any) => ({
      itunes_id: item.collectionId,
      title: item.collectionName,
      image_url: item.artworkUrl600,
      itunes_url: item.collectionViewUrl,
      description: item.description || '',
      publisher: item.artistName || '',
      feed_url: item.feedUrl || '',
    }));

    await this.podcastRepo.upsert(podcastsItems, ['itunes_id']);

    for (const podcast of podcastsItems) {
      try {
        await this.storeEpisodes(podcast);
      } catch (err) {
        console.error('...');
      }
    }
  }

  async search(term: string): Promise<Podcast[]> {
    if (!term) {
      throw new NotFoundException('Search term is required');
    }

    let podcasts = await this.podcastRepo
      .createQueryBuilder('podcast')
      .where('podcast.title ILIKE :term', { term: `%${term}%` })
      .orWhere('podcast.description ILIKE :term', { term: `%${term}%` })
      .orWhere('podcast.publisher ILIKE :term', { term: `%${term}%` })
      .orderBy('id', 'ASC')
      .getMany();

    if (!podcasts.length) {
      await this.refresh(term);

      podcasts = await this.podcastRepo
        .createQueryBuilder('podcast')
        .where('podcast.title ILIKE :term', { term: `%${term}%` })
        .orWhere('podcast.description ILIKE :term', { term: `%${term}%` })
        .orWhere('podcast.publisher ILIKE :term', { term: `%${term}%` })
        .orderBy('id', 'ASC')
        .getMany();

      if (!podcasts.length) {
        throw new NotFoundException('No podcasts found from iTunes');
      }
    }

    return podcasts;
  }

  async fetchEpisodesFromFeed(feedUrl: string) {
    try {
      const response = await axios.get(feedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000,
      });

      const parser = new xml2js.Parser({ explicitArray: false });
      const parsed = await parser.parseStringPromise(response.data);

      const items = parsed?.rss?.channel?.item;

      if (!items) return [];

      const episodes = Array.isArray(items) ? items : [items];

      return episodes.map((ep: any) => ({
        title: ep.title,
        description: ep.description || '',
        audioUrl: ep.enclosure?.['$']?.url || '',
        pubDate: new Date(ep.pubDate),
        imageUrl:
          ep['itunes:image']?.['$']?.href ||
          ep['media:thumbnail']?.['$']?.url ||
          ep['image']?.url ||
          '',
      }));
    } catch (err) {
      console.error(`Failed to fetch RSS from ${feedUrl}:`, err.message);
      return [];
    }
  }

  async storeEpisodes(podcast: Podcast) {
    if (!podcast.feed_url?.match(/^https?:\/\//)) {
      console.warn(`Skipping podcast (invalid feed_url): ${podcast.title}`);
      return;
    }

    const episodesData = await this.fetchEpisodesFromFeed(podcast.feed_url);

    if (!episodesData.length) {
      console.warn(`There is no episodes in RSS: ${podcast.title}`);
      return;
    }

    await this.episodeRepo.delete({ podcast: { id: podcast.id } });

    const episodes = episodesData.map((ep) => {
      const imageUrl =
        ep['itunes:image']?.['$']?.href ||
        ep['media:thumbnail']?.['$']?.url ||
        ep['image']?.url ||
        ep.imageUrl ||
        '';

      return this.episodeRepo.create({
        title: ep.title ?? '',
        description: ep.description ?? '',
        audioUrl: ep.audioUrl ?? '',
        pubDate: ep.pubDate ? new Date(ep.pubDate) : null,
        imageUrl,
        podcast,
      });
    });

    await this.episodeRepo.save(episodes);
  }

  async searchById(itunes_id: number): Promise<Podcast> {
    try {
      const res = await axios.get(
        `https://itunes.apple.com/lookup?id=${itunes_id}&entity=podcast`,
        {
          validateStatus: (status) => status === 200,
        },
      );

      if (!res.data.results?.length) {
        throw new NotFoundException('Podcast not found');
      }

      const item = res.data.results[0];
      return this.upsertPodcast({
        itunesId: item.collectionId,
        title: item.collectionName,
        imageUrl: item.artworkUrl600,
        itunesUrl: item.collectionViewUrl,
        description: item.description || '',
        publisher: item.artistName || '',
        feedUrl: item.feedUrl || '',
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      // Handle axios errors specifically
      if (axios.isAxiosError(error)) {
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
          throw new NotFoundException(
            'Request timed out while fetching podcast',
          );
        }
        if (error.response?.status === 404) {
          throw new NotFoundException('Podcast not found');
        }
      }

      // Generic error fallback
      throw new NotFoundException('Failed to fetch podcast details');
    }
  }

  private async upsertPodcast(data: {
    itunesId: number;
    title: string;
    imageUrl: string;
    itunesUrl: string;
    description: string;
    publisher: string;
    feedUrl: string;
  }): Promise<Podcast> {
    const existing = await this.podcastRepo.findOne({
      where: { itunes_id: data.itunesId },
    });

    if (existing) {
      existing.title = data.title;
      existing.image_url = data.imageUrl;
      existing.itunes_url = data.itunesUrl;
      existing.description = data.description;
      existing.publisher = data.publisher;
      return this.podcastRepo.save(existing);
    }

    return this.podcastRepo.save(
      this.podcastRepo.create({
        itunes_id: data.itunesId,
        title: data.title,
        image_url: data.imageUrl,
        itunes_url: data.itunesUrl,
        description: data.description,
        publisher: data.publisher,
        feed_url: data.feedUrl,
      }),
    );
  }
}
