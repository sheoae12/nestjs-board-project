import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  SetMetadata,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserInfo } from 'src/common/decorators/user-info.decorator';
import { IUserInfo } from 'src/common/types/user-info.type';
import { UserAuthGuard } from 'src/common/guards/user-auth.guard';
import { HttpExceptionFilter } from 'src/common/exception-filters/exception-filter';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateNicknameDto } from './dto/req.dto';

@ApiBearerAuth('accessToken')
@UseGuards(UserAuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@ApiTags('[USER]')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: '유저 정보 조회' })
  @SetMetadata('exclude', true)
  @Get(':userId')
  async getUserInfo(@Param(ParseIntPipe) userId: number) {
    return this.userService.getUserInfo(userId);
  }

  @Patch('nickname')
  async updateNickname(
    @Body() payload: UpdateNicknameDto,
    @UserInfo() user: IUserInfo,
  ) {
    payload.userId = user.sub;
    return this.userService.updateNickname(payload);
  }
}
