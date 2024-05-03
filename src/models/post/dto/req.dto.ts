import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional, MaxLength } from 'class-validator';
import { PagingDto } from 'src/common/dto/paging.dto';
import { Post } from 'src/entities/post.entity';

export class GetPostListDto extends PagingDto {
  @IsOptional()
  userId: number;
}

export class CreatePostDto {
  @ApiProperty({
    description: '제목',
    example: '성북구 맛집 리스트',
  })
  @MaxLength(50)
  title: string;

  @ApiProperty({
    description: '내용',
    example: '제가 다년간 거주하면서 모은 성북구 맛집 정보입니다.',
  })
  @MaxLength(1000)
  content: string;

  @IsOptional()
  userId: number;
}

export class UpdatePostDto extends PickType(CreatePostDto, [
  'title',
  'content',
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

export class DeletePostDto extends PickType(Post, ['id']) {}
