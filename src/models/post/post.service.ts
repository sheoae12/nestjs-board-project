import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Post } from 'src/entities/post.entity';
import { PostRepository } from 'src/repositories/post.repository';
import { CreatePostDto, GetPostListDto, UpdatePostDto } from './dto/req.dto';
import { IUserInfo } from 'src/common/types/user-info.type';
import { ResMessage } from 'src/common/message/res-message';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CategoryRepository } from 'src/repositories/category.repository';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);
  constructor(
    private postRepository: PostRepository,
    private categoryRepository: CategoryRepository,
    private dataSource: DataSource,
  ) {}

  async getPostList(query: GetPostListDto) {
    return await this.postRepository.getPostList(query);
  }

  async getPost(id: number) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) return new BadRequestException(ResMessage.POST_NOT_FOUND);
    return post;
  }

  async createPost(payload: CreatePostDto) {
    const { userId, categoryId } = payload;

    await this.checkUserExist(userId);

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) throw new BadRequestException(ResMessage.CATEGORY_NOT_FOUND);
    if (!category.parent)
      throw new BadRequestException(ResMessage.CANNOT_USE_ROOT_CATEGORY);

    const post = plainToInstance(Post, payload);

    try {
      await this.postRepository.save(post);
    } catch (error) {
      this.logger.error('createPost::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  async updatePost(payload: UpdatePostDto, user: IUserInfo) {
    const { id, categoryId } = payload;

    await this.checkUserExist(payload.userId);

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) throw new BadRequestException(ResMessage.CATEGORY_NOT_FOUND);
    if (!category.parent)
      throw new BadRequestException(ResMessage.CANNOT_USE_ROOT_CATEGORY);

    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new BadRequestException(ResMessage.POST_NOT_FOUND);

    this.checkIsAuthor(post.userId, user.sub);

    try {
      await this.postRepository.update(id, plainToInstance(Post, payload));
    } catch (error) {
      this.logger.error('updatePost::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  async deletePost(postId: number, user: IUserInfo) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) throw new BadRequestException(ResMessage.POST_NOT_FOUND);

    this.checkIsAuthor(post.userId, user.sub);

    try {
      await this.postRepository.delete(postId);
    } catch (error) {
      this.logger.error('deletePost::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  checkIsAuthor(postUserId: number, userId: number) {
    if (postUserId !== userId)
      throw new ForbiddenException(ResMessage.NOT_AUTHOR);
  }

  async checkUserExist(userId: number) {
    const user = await this.dataSource.manager.findOneBy(User, { id: userId });
    if (!user) throw new UnauthorizedException(ResMessage.USER_NOT_FOUND);
  }
}
