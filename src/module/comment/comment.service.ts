import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './dto/req.dto';
import { ResMessage } from 'src/common/message/res-message';
import { CommentRepository } from 'src/repositories/comment.repository';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { plainToInstance } from 'class-transformer';
import { Comment } from 'src/entities/comment.entity';
import { IUserInfo } from 'src/common/types/user-info.type';

@Injectable()
export class CommentService {
  private logger = new Logger(CommentService.name);

  constructor(
    private commentRepository: CommentRepository,
    private dataSource: DataSource,
  ) {}

  async getComments(postId: number) {
    await this.checkPostExist(postId);

    try {
      return this.commentRepository.find();
    } catch (error) {
      this.logger.error('getComments::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  async createComment(payload: CreateCommentDto) {
    const { postId, userId } = payload;

    await this.checkUserExist(userId);
    await this.checkPostExist(postId);

    const comment = plainToInstance(Comment, payload);

    try {
      await this.commentRepository.save(comment);
    } catch (error) {
      this.logger.error('createComment::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  async updateComment(payload: UpdateCommentDto, user: IUserInfo) {
    const { userId, commentId } = payload;

    await this.checkUserExist(userId);

    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) throw new NotFoundException(ResMessage.COMMENT_NOT_FOUND);

    this.checkIsAuthor(comment.userId, user.sub);

    try {
      await this.commentRepository.update(
        commentId,
        plainToInstance(Comment, payload),
      );
    } catch (error) {
      this.logger.error('updateComment::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  async deleteComment(id: number, user: IUserInfo) {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException(ResMessage.COMMENT_NOT_FOUND);

    this.checkIsAuthor(comment.userId, user.sub);

    try {
      await this.commentRepository.softDelete(id);
    } catch (error) {
      this.logger.error('deleteComment::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  checkIsAuthor(commentUserId: number, userId: number) {
    if (commentUserId !== userId)
      throw new ForbiddenException(ResMessage.NOT_AUTHOR);
  }

  async checkUserExist(userId: number) {
    const user = await this.dataSource.manager.findOneBy(User, { id: userId });
    if (!user) throw new BadRequestException(ResMessage.USER_NOT_FOUND);
  }

  async checkPostExist(postId: number) {
    const post = await this.dataSource.manager.findOneBy(Post, { id: postId });
    if (!post) throw new BadRequestException(ResMessage.POST_NOT_FOUND);
  }
}
