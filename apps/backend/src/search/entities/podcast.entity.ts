import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Podcast {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  image_url: string;

  @Column()
  itunes_url: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  publisher: string;
}
