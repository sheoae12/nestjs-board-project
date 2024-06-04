import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  SetMetadata,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/common/guards/user-auth.guard';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from 'src/common/exception-filters/exception-filter';
import { UserInfo } from 'src/common/decorators/user-info.decorator';
import { IUserInfo } from 'src/common/types/user-info.type';
import { CreateCommentDto, UpdateCommentDto } from './dto/req.dto';

@ApiBearerAuth('accessToken')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@UseGuards(UserAuthGuard)
@ApiTags('[COMMENT]')
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @SetMetadata('exclude', true)
  @Get(':postId')
  async getComments(@Param(ParseIntPipe) postId: number) {
    return await this.commentService.getComments(postId);
  }

  @Post()
  async createComment(
    @Body() payload: CreateCommentDto,
    @UserInfo() user: IUserInfo,
  ) {
    payload.userId = user.sub;
    return await this.commentService.createComment(payload);
  }

  @Patch()
  async updateComment(
    @Body() payload: UpdateCommentDto,
    @UserInfo() user: IUserInfo,
  ) {
    return await this.commentService.updateComment(payload, user);
  }

  @Delete(':commentId')
  async deleteComment(
    @Param(ParseIntPipe) commentId: number,
    @UserInfo() user: IUserInfo,
  ) {
    return await this.commentService.deleteComment(commentId, user);
  }
}
