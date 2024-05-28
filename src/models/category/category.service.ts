import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PostCategory } from 'src/entities/category.entity';
import { DataSource } from 'typeorm';
import { CreateCategoryDto } from './dto/req.dto';
import { ResMessage } from 'src/common/message/res-message';
import { CategoryRepository } from 'src/repositories/category.repository';
import { plainToInstance } from 'class-transformer';
import { Post } from 'src/entities/post.entity';

@Injectable()
export class CategoryService {
  private logger = new Logger(CategoryService.name);
  constructor(
    private dataSource: DataSource,
    private categoryRepository: CategoryRepository,
  ) {}

  async getCategory() {
    try {
      return await this.categoryRepository.findTrees();
    } catch (error) {
      this.logger.error('getCategory::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  async createCategory(payload: CreateCategoryDto) {
    try {
      return await this.categoryRepository.save(
        plainToInstance(PostCategory, payload),
      );
    } catch (error) {
      this.logger.error('createCategory::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  async deleteCategory(categoryId: number) {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) throw new BadRequestException(ResMessage.CATEGORY_NOT_FOUND);

    const childs = await this.categoryRepository.getChilds(categoryId);
    if (childs.length)
      throw new ForbiddenException('cannot delete parent category');

    const post = await this.dataSource.manager.findBy(Post, { categoryId });
    if (post.length)
      throw new ForbiddenException('cannot delete in-use category');

    try {
      await this.categoryRepository.delete(categoryId);
    } catch (error) {
      this.logger.error('deleteCategory::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }
}
