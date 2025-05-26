// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity()
// export class Podcast {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: true })
//   itunes_id: number;

//   @Column()
//   title: string;

//   @Column()
//   image_url: string;

//   @Column()
//   itunes_url: string;

//   @Column({ nullable: true })
//   description: string;

//   @Column({ nullable: true })
//   publisher: string;
//   episodes: any;
// }
// src/search/podcast.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Episode } from './episode.entity';

@Entity()
export class Podcast {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  itunes_id: number;

  @Column()
  image_url: string;

  @Column()
  itunes_url: string;

  @Column({ nullable: true })
  feed_url: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  publisher: string;

  @OneToMany(() => Episode, (episode) => episode.podcast, { cascade: true })
  episodes: Episode[];
}
