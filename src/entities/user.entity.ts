import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Entity({ name: 'user' })
export class User extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 512 })
  password: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  nickname: string;

  @OneToMany(() => Post, (posts) => posts.user)
  posts: Post[];

  @OneToMany(() => Comment, (comments) => comments.user)
  comments: Comment[];
}
