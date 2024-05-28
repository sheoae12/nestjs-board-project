import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from 'src/repositories/post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { PostCategory } from 'src/entities/category.entity';
import { CategoryRepository } from 'src/repositories/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory])],
  controllers: [PostController],
  providers: [PostService, PostRepository, CategoryRepository],
})
export class PostModule {}
