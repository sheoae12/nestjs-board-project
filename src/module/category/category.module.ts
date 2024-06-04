import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCategory } from 'src/entities/category.entity';
import { CategoryRepository } from 'src/repositories/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
