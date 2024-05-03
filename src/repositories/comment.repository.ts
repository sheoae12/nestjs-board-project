import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(Comment)
    private repository: Repository<Comment>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
