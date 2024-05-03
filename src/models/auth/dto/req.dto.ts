import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';
import { IsValidPassword } from 'src/common/util/regex';
import { User } from 'src/entities/user.entity';

/* 회원가입 정보는 확장가능 */
export class SignUpDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: '@3!pwd!#',
  })
  @IsValidPassword()
  @MaxLength(15)
  password: string;
}

export class SignInDto extends PickType(SignUpDto, ['email', 'password']) {}

export class WithDrawUserDto extends PickType(User, ['id']) {}
