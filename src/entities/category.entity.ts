import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Post } from './post.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, MaxLength } from 'class-validator';

@Entity('post_category')
@Tree('adjacency-list')
export class PostCategory {
  @ApiProperty({ description: 'category id', example: 5, type: 'number' })
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'category text', example: 'game' })
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100 })
  text: string;

  @TreeParent()
  parent: PostCategory;

  @TreeChildren({ cascade: true })
  children: PostCategory[];

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
