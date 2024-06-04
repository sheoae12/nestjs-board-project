import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class UpdateNicknameDto {
  @ApiProperty({
    description: '닉네임',
    example: '동글이',
  })
  @MaxLength(20)
  nickname: string;

  @IsOptional()
  userId: number;
}
