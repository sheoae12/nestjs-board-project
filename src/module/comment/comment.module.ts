import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from 'src/repositories/comment.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
