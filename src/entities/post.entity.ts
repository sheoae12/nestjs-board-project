import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { PostCategory } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, MaxLength } from 'class-validator';

// TODO: index (검색 향상)
@Entity()
export class Post extends Base {
  @ApiProperty({
    description: '게시글 id',
    example: 15,
    type: 'number',
  })
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '카테고리 id',
    example: 5,
  })
  @IsNumber()
  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @ApiProperty({
    description: '제목',
    example: '성북구 맛집 리스트',
  })
  @MaxLength(50)
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @ApiProperty({
    description: '내용',
    example: '제가 다년간 거주하면서 모은 성북구 맛집 정보입니다.',
  })
  @MaxLength(1000)
  @Column({ type: 'varchar', length: 1000 })
  content: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => User, (user) => user.posts, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => PostCategory, (pc) => pc.posts, { cascade: true })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: PostCategory;

  @OneToMany(() => Comment, (comments) => comments.post)
  comments: Comment[];
}
