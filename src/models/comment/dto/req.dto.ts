import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    example: '잘 보고 갑니다~',
  })
  @MaxLength(500)
  text: string;

  @ApiProperty({
    description: '게시글 id',
    example: 15,
    type: 'number',
  })
  @IsNumber()
  postId: number;

  @ApiProperty({
    description: '상위 댓글 id',
    example: 24,
    type: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  parentId: number;

  @IsOptional()
  userId: number;
}

export class UpdateCommentDto extends PickType(CreateCommentDto, [
  'text',
  'userId',
]) {
  @ApiProperty({
    description: '댓글 id',
    example: 63,
    type: 'number',
  })
  @IsNumber()
  id: number;
}
