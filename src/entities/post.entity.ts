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

// TODO: index (검색 향상)
@Entity()
export class Post extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @Column({ type: 'varchar', length: 50 })
  title: string;

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
