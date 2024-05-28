import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception-filters/exception-filter';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreatePostDto, GetPostListDto, UpdatePostDto } from './dto/req.dto';
import { UserAuthGuard } from 'src/common/guards/user-auth.guard';
import { UserInfo } from 'src/common/decorators/user-info.decorator';
import { IUserInfo } from 'src/common/types/user-info.type';

@ApiBearerAuth('accessToken')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@UseGuards(UserAuthGuard)
@ApiTags('[POST]')
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiOperation({ summary: '게시글 상세 조회' })
  @SetMetadata('exclude', true)
  @Get(':id')
  async getPost(@Param(ParseIntPipe) id: number) {
    return await this.postService.getPost(id);
  }

  @ApiOkResponse()
  @ApiOperation({ summary: '게시글 목록 조회' })
  @SetMetadata('exclude', true)
  @Get()
  async getPostList(@Query() query: GetPostListDto) {
    return await this.postService.getPostList(query);
  }

  @ApiOkResponse({ status: 201 })
  @ApiInternalServerErrorResponse()
  @ApiOperation({ summary: '게시글 생성' })
  @Post()
  async createPost(
    @Body() payload: CreatePostDto,
    @UserInfo() user: IUserInfo,
  ) {
    payload.userId = user.sub;
    return await this.postService.createPost(payload);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  @ApiOperation({ summary: '게시글 수정' })
  @Patch()
  async updatePost(
    @Body() payload: UpdatePostDto,
    @UserInfo() user: IUserInfo,
  ) {
    return await this.postService.updatePost(payload, user);
  }

  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':postId')
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @UserInfo() user: IUserInfo,
  ) {
    return await this.postService.deletePost(postId, user);
  }
}
