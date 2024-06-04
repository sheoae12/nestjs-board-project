import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResMessage } from 'src/common/message/res-message';
import { CommentService } from 'src/module/comment/comment.service';
import { CommentRepository } from 'src/repositories/comment.repository';
import { DataSource } from 'typeorm';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: CommentRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: jest.fn().mockImplementation(() => {
            manager: jest.fn().mockImplementation(() => {
              findOneBy: jest.fn();
            });
          }),
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getComments', () => {
    it('should throw error if post not exist', async () => {
      // given
      const postId = 9999;

      jest
        .spyOn(service, 'checkPostExist')
        .mockRejectedValue(new BadRequestException(ResMessage.POST_NOT_FOUND));

      // when, then
      expect(service.getComments(postId)).rejects.toStrictEqual(
        new BadRequestException(ResMessage.POST_NOT_FOUND),
      );
    });

    it('should get comment list', async () => {
      // given
      // 부모-자식 트리 형태로..
      // when
    });
  });

  describe('createComment', () => {
    it('should throw error if user not exist', async () => {});

    it('should throw error if post not exist', async () => {});

    it('should create comment', async () => {});
  });

  describe('updateComment', () => {
    it('should throw error if user not exist', async () => {});

    it('should throw error if comment not exist', async () => {});

    it('should throw error if not an author', async () => {});

    it('should update comment', async () => {});
  });

  describe('deleteComment', () => {
    it('should throw error if user not exist', async () => []);

    it('should throw error if not an author', async () => {});

    it('should soft-delete comment', async () => {});
  });
});
