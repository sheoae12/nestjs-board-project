import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { GetPostListDto } from 'src/module/post/dto/req.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(Post)
    private repository: Repository<Post>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  // TODO: category 별 검색도 추가
  async getPostList(query: GetPostListDto): Promise<[Post[], number]> {
    const { userId } = query;

    const qb = this.repository
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.title',
        'p.content',
        'p.createdTime',
        'u.id',
        'u.nickname',
      ])
      .leftJoin('p.user', 'u');

    if (userId) qb.andWhere('u.id = :userId', { userId });

    return qb.getManyAndCount();
  }
}
