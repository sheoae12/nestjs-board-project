import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Base } from './base.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

// tree entity로 구성
@Entity()
//@Tree('materialized-path')
@Tree('adjacency-list')
export class Comment extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  text: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @TreeParent()
  parent: Comment;

  @TreeChildren({ cascade: false })
  children: Comment[];

  @DeleteDateColumn()
  deletedTime: Date | string;

  @ManyToOne(() => Post, (post) => post.comments, { cascade: true })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
