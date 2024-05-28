import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PostCategory } from 'src/entities/category.entity';
import { DataSource, Repository, TreeRepository } from 'typeorm';

@Injectable()
export class CategoryRepository extends Repository<PostCategory> {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PostCategory)
    private repository: Repository<PostCategory>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findTrees() {
    return this.repository
      .createQueryBuilder('category')
      .select(['category.id', 'category.text', 'children'])
      .leftJoin(
        'category.children',
        'children',
        'children.parent = category.id',
      )
      .where('category.parent IS NULL')
      .getMany();
  }

  getChilds(categoryId: number) {
    return this.repository
      .createQueryBuilder('category')
      .select(['category.id'])
      .where('category.parent = :parent', { parent: categoryId })
      .getMany();
  }

  getCategories() {
    return this.repository
      .createQueryBuilder('category')
      .select(['category.id', 'category.text', 'category.children'])
      .getMany();
  }
}
