import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { PagingDto } from 'src/common/dto/paging.dto';
import { Post } from 'src/entities/post.entity';

export class GetPostListDto extends PagingDto {
  @IsOptional()
  userId: number;
}

export class CreatePostDto extends PickType(Post, [
  'title',
  'content',
  'categoryId',
]) {
  @IsOptional()
  userId: number;
}

export class UpdatePostDto extends PickType(CreatePostDto, [
  'title',
  'content',
  'categoryId',
  'userId',
]) {
  @ApiProperty({
    description: '게시글 id',
    example: 15,
    type: 'number',
  })
  @IsNumber()
  id: number;
}
