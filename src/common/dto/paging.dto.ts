import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class PagingDto {
  @ApiProperty({
    description: '페이지 번호',
    example: 1,
  })
  @IsNumberString()
  pageNo: number;

  @ApiProperty({
    description: '페이지 사이즈',
    example: 10,
  })
  @IsNumberString()
  pageSize: number;
}
