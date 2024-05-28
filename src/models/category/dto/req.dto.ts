import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PostCategory } from 'src/entities/category.entity';

export class CreateCategoryDto extends PickType(PostCategory, ['text']) {
  @ApiProperty({ description: '부모 카테고리 id', example: 1, required: false })
  @IsOptional()
  parent: number;
}
