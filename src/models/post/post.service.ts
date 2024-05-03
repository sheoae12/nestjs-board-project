import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Post } from 'src/entities/post.entity';
import { PostRepository } from 'src/repositories/post.repository';
import { CreatePostDto, DeletePostDto, UpdatePostDto } from './dto/req.dto';
import { IUserInfo } from 'src/common/types/user-info.type';
import { ResMessage } from 'src/common/message/res-message';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);
  constructor(
    private postRepository: PostRepository,
    private dataSource: DataSource,
  ) {}

  async getPostList(query) {
    return await this.postRepository.getPostList(query);
  }

  async getPost(id: number) {
    return await this.postRepository.findOneBy({ id });
  }

  async createPost(payload: CreatePostDto) {
    await this.checkUserExist(payload.userId);

    const post = plainToInstance(Post, payload);

    try {
      await this.postRepository.save(post);
    } catch (error) {
      this.logger.error('createPost::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  async updatePost(payload: UpdatePostDto, user: IUserInfo) {
    const { id } = payload;

    await this.checkUserExist(payload.userId);

    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException(ResMessage.POST_NOT_FOUND);

    this.checkIsAuthor(post.userId, user.sub);

    try {
      await this.postRepository.update(id, plainToInstance(Post, payload));
    } catch (error) {
      this.logger.error('updatePost::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  async deletePost(payload: DeletePostDto, user: IUserInfo) {
    const { id } = payload;

    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException(ResMessage.POST_NOT_FOUND);

    this.checkIsAuthor(post.userId, user.sub);

    try {
      await this.postRepository.delete(id);
    } catch (error) {
      this.logger.error('deletePost::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  checkIsAuthor(postUserId: number, userId: number) {
    if (postUserId !== userId)
      throw new ForbiddenException('no permission: not an author');
  }

  async checkUserExist(userId: number) {
    const user = await this.dataSource.manager.findOneBy(User, { id: userId });
    if (!user) throw new NotFoundException(ResMessage.USER_NOT_FOUND);
  }
}
