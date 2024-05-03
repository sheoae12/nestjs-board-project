import {
  Body,
  Controller,
  Delete,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SignInDto, SignUpDto, WithDrawUserDto } from './dto/req.dto';
import { HttpExceptionFilter } from 'src/common/exception-filters/exception-filter';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('[AUTH]')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  @ApiOkResponse({ status: 201 })
  @ApiOperation({ summary: '회원가입' })
  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  @ApiNotFoundResponse()
  @ApiOperation({ summary: '로그인' })
  @Post('signin')
  async signIn(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }

  @ApiInternalServerErrorResponse()
  @ApiNotFoundResponse()
  @ApiOperation({ summary: '탈퇴' })
  @Delete('withdraw')
  async withdrawUser(@Body() body: WithDrawUserDto) {
    return await this.authService.withdrawUser(body);
  }
}
