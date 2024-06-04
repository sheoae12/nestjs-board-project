import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호',
  })
  password: string;

  @ApiProperty({
    description: '닉네임',
  })
  @MaxLength(20)
  nickname: string;
}
