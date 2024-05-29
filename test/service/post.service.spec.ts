import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../../src/models/post/post.service';
import { CategoryRepository } from 'src/repositories/category.repository';
import { DataSource } from 'typeorm';
import { PostRepository } from 'src/repositories/post.repository';
import { plainToInstance } from 'class-transformer';
import {
  CreatePostDto,
  GetPostListDto,
  UpdatePostDto,
} from '../../src/models/post/dto/req.dto';
import { Post } from 'src/entities/post.entity';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResMessage } from 'src/common/message/res-message';
import { IUserInfo } from 'src/common/types/user-info.type';
import { PostCategory } from 'src/entities/category.entity';

describe('PostService', () => {
  let service: PostService;
  let postRepository: PostRepository;
  let categoryRepository: CategoryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostRepository,
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            getPostList: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CategoryRepository,
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
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

    service = module.get<PostService>(PostService);
    postRepository = module.get<PostRepository>(PostRepository);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPostList', () => {
    it('should return all post list', async () => {
      // given
      const query = plainToInstance(GetPostListDto, {
        pageNo: 1,
        pageSize: 10,
      });
      const postResult: [Post[], number] = [
        [
          plainToInstance(Post, {
            id: 1,
            categoryId: 5,
            title: 'post1',
            content: 'content1',
            createdTime: '2024-05-10 00:00:00',
            user: { id: 1, nickname: 'user1' },
          }),
          plainToInstance(Post, {
            id: 2,
            categoryId: 5,
            title: 'post2',
            content: 'content2',
            createdTime: '2024-05-10 00:00:00',
            user: { id: 2, nickname: 'user2' },
          }),
        ],
        2,
      ];

      const postRepositorySpy = jest
        .spyOn(postRepository, 'getPostList')
        .mockResolvedValue(postResult);

      // when
      const result = await service.getPostList(query);

      // then
      expect(postRepositorySpy).toHaveBeenCalledWith(query);
      expect(result).toBe(postResult);
    });

    it("should return specific user's post list", async () => {
      // given
      const query = plainToInstance(GetPostListDto, {
        pageNo: 1,
        pageSize: 10,
        userId: 1,
      });
      const postResult: [Post[], number] = [
        [
          plainToInstance(Post, {
            id: 1,
            categoryId: 5,
            title: 'post1',
            content: 'content1',
            createdTime: '2024-05-10 00:00:00',
            user: { id: 1, nickname: 'user1' },
          }),
        ],
        1,
      ];

      const postRepositorySpy = jest
        .spyOn(postRepository, 'getPostList')
        .mockResolvedValue(postResult);

      // when
      const result = await service.getPostList(query);

      // then
      expect(postRepositorySpy).toHaveBeenCalledWith(query);
      expect(result).toBe(postResult);
    });
  });

  describe('getPost', () => {
    it('should throw error if postId not exist', async () => {
      // given
      const postId = 9999;

      const postRepositorySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(null);

      // when
      const result = await service.getPost(postId);

      // then
      expect(result).toStrictEqual(
        new BadRequestException(ResMessage.POST_NOT_FOUND),
      );
      expect(postRepositorySpy).toHaveBeenCalledWith({ id: postId });
    });

    it('should return post detail', async () => {
      // given
      const postId = 1;
      const post = plainToInstance(Post, {
        id: 1,
        categoryId: 5,
        title: 'post12',
        content: 'content1',
        createdTime: '2024-05-05 00:00:00',
        user: {
          id: 1,
          nickname: 'user1',
        },
      });

      // ----------------- category이렇게 안나오지 싶은데
      const postRepositorySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(post);

      // when
      const result = await service.getPost(postId);

      // then
      expect(postRepositorySpy).toHaveBeenCalledWith({ id: postId });
      expect(result).toBe(post);
    });
  });

  describe('createPost', () => {
    const inputData = {
      title: 'post',
      content: 'content',
    };

    it('should throw error if user not exist', async () => {
      // given
      const payload = plainToInstance(CreatePostDto, {
        ...inputData,
        categoryId: 5,
        userId: 9999,
      });

      jest
        .spyOn(service, 'checkUserExist')
        .mockRejectedValue(
          new UnauthorizedException(ResMessage.USER_NOT_FOUND),
        );

      // when, then
      expect(service.createPost(payload)).rejects.toStrictEqual(
        new UnauthorizedException(ResMessage.USER_NOT_FOUND),
      );
    });

    it('should throw error if no category', async () => {
      // given
      const payload = plainToInstance(CreatePostDto, {
        ...inputData,
        categoryId: 9999,
        userId: 1,
      });

      jest.spyOn(service, 'checkUserExist').mockResolvedValue();
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null);

      // when, then
      expect(service.createPost(payload)).rejects.toStrictEqual(
        new BadRequestException(ResMessage.CATEGORY_NOT_FOUND),
      );
    });

    it('should throw error if cagory is a root', async () => {
      // given
      const payload = plainToInstance(CreatePostDto, {
        ...inputData,
        categoryId: 1,
        userId: 1,
      });

      jest.spyOn(service, 'checkUserExist').mockResolvedValue();
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(
        plainToInstance(PostCategory, {
          id: 1,
          parent: null,
        }),
      );

      // when, then
      expect(service.createPost(payload)).rejects.toStrictEqual(
        new BadRequestException(ResMessage.CANNOT_USE_ROOT_CATEGORY),
      );
    });

    it('should create post', async () => {
      // given
      const payload = plainToInstance(CreatePostDto, {
        ...inputData,
        categoryId: 5,
        userId: 1,
      });

      const post = plainToInstance(Post, payload);

      jest.spyOn(service, 'checkUserExist').mockResolvedValue();
      const categoryRepositorySpy = jest
        .spyOn(categoryRepository, 'findOneBy')
        .mockResolvedValue(
          plainToInstance(PostCategory, {
            id: 5,
            parent: 1,
          }),
        );
      const postRepositorySpy = jest
        .spyOn(postRepository, 'save')
        .mockResolvedValue(post);

      // when
      await service.createPost(payload);

      // then
      expect(categoryRepositorySpy).toHaveBeenCalledWith({
        id: payload.categoryId,
      });
      expect(postRepositorySpy).toHaveBeenCalledWith(post);
    });
  });

  describe('updatePost', () => {
    const inputData = {
      title: 'post_updated',
      content: 'content_updated',
    };

    const user: IUserInfo = {
      sub: 1,
      email: 'user@test.com',
    };

    it('should throw error if user not exist', async () => {
      // given
      const payload = plainToInstance(UpdatePostDto, {
        ...inputData,
        id: 1,
        categoryId: 5,
        userId: 9999,
      });

      jest
        .spyOn(service, 'checkUserExist')
        .mockRejectedValue(
          new UnauthorizedException(ResMessage.USER_NOT_FOUND),
        );

      // when, then
      expect(service.updatePost(payload, user)).rejects.toStrictEqual(
        new UnauthorizedException(ResMessage.USER_NOT_FOUND),
      );
    });

    it('should throw error if no category', async () => {
      // given
      const payload = plainToInstance(UpdatePostDto, {
        ...inputData,
        id: 1,
        categoryId: 9999,
        userId: 1,
      });

      jest.spyOn(service, 'checkUserExist').mockResolvedValue();
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(null);

      // when, then
      expect(service.updatePost(payload, user)).rejects.toStrictEqual(
        new BadRequestException(ResMessage.CATEGORY_NOT_FOUND),
      );
    });

    it('should throw error if category is a root', async () => {
      // given
      const payload = plainToInstance(UpdatePostDto, {
        ...inputData,
        id: 1,
        categoryId: 1,
        userId: 1,
      });

      jest.spyOn(service, 'checkUserExist').mockResolvedValue();
      jest.spyOn(categoryRepository, 'findOneBy').mockResolvedValue(
        plainToInstance(PostCategory, {
          id: 1,
          parent: null,
        }),
      );

      // when, then
      expect(service.updatePost(payload, user)).rejects.toStrictEqual(
        new BadRequestException(ResMessage.CANNOT_USE_ROOT_CATEGORY),
      );
    });

    it('should throw error if post not exsit', async () => {
      // given
      const payload = plainToInstance(UpdatePostDto, {
        ...inputData,
        id: 9999,
        categoryId: 5,
        userId: 1,
      });

      jest.spyOn(service, 'checkUserExist').mockResolvedValue();
      const categoryRepositorySpy = jest
        .spyOn(categoryRepository, 'findOneBy')
        .mockResolvedValue(
          plainToInstance(PostCategory, {
            id: 5,
            parent: 1,
          }),
        );
      const postRepositorySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(null);

      // then, when
      expect(service.updatePost(payload, user)).rejects.toStrictEqual(
        new BadRequestException(ResMessage.POST_NOT_FOUND),
      );
      expect(categoryRepositorySpy).toHaveBeenCalledWith({
        id: payload.categoryId,
      });
      expect(postRepositorySpy).toHaveBeenCalledWith({ id: payload.id });
    });

    it('should throw error if not an author', async () => {
      // given
      const payload = plainToInstance(UpdatePostDto, {
        ...inputData,
        id: 1,
        categoryId: 5,
        userId: 1,
      });
      const fakeUser: IUserInfo = { sub: 2, email: 'user2@test.com' };
      const post = plainToInstance(Post, payload);

      jest.spyOn(service, 'checkUserExist').mockResolvedValue();
      const categoryRepositorySpy = jest
        .spyOn(categoryRepository, 'findOneBy')
        .mockResolvedValue(
          plainToInstance(PostCategory, {
            id: 5,
            parent: 1,
          }),
        );
      const postRepositorySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(post);

      // when, then
      expect(service.updatePost(payload, fakeUser)).rejects.toStrictEqual(
        new ForbiddenException(ResMessage.NOT_AUTHOR),
      );
      expect(categoryRepositorySpy).toHaveBeenCalledWith({
        id: payload.categoryId,
      });
      expect(postRepositorySpy).toHaveBeenCalledWith({ id: payload.id });
    });

    it('should update post', async () => {
      // given
      const payload = plainToInstance(UpdatePostDto, {
        ...inputData,
        id: 1,
        categoryId: 5,
        userId: 1,
      });
      const post = plainToInstance(Post, payload);

      jest.spyOn(service, 'checkUserExist').mockResolvedValue();
      const categoryRepositorySpy = jest
        .spyOn(categoryRepository, 'findOneBy')
        .mockResolvedValue(
          plainToInstance(PostCategory, {
            id: 5,
            parent: 1,
          }),
        );
      const postRepositorySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(post);
      jest.spyOn(service, 'checkIsAuthor');
      const postUpdateSpy = jest.spyOn(postRepository, 'update');

      // when
      await service.updatePost(payload, user);

      // then
      expect(categoryRepositorySpy).toHaveBeenCalledWith({
        id: payload.categoryId,
      });
      expect(postRepositorySpy).toHaveBeenCalledWith({ id: payload.id });
      expect(postUpdateSpy).toHaveBeenCalledWith(payload.id, post);
    });
  });

  describe('deletePost', () => {
    const user: IUserInfo = { sub: 1, email: 'user@test.com' };
    const fakeUser: IUserInfo = { sub: 2, email: 'user2@test.com' };

    const post = plainToInstance(Post, {
      id: 1,
      title: 'post',
      content: 'content',
      categoryId: 5,
      userId: 1,
    });

    it('should throw error if post not exist', async () => {
      // given
      const postId = 9999;

      const postRepositorySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(null);

      // when, then
      expect(service.deletePost(postId, user)).rejects.toStrictEqual(
        new BadRequestException(ResMessage.POST_NOT_FOUND),
      );
      expect(postRepositorySpy).toHaveBeenCalledWith({ id: postId });
    });

    it('should thorw error it not an author', async () => {
      // given
      const postId = 1;

      const postRepositorySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(post);

      // when, then
      expect(service.deletePost(postId, fakeUser)).rejects.toStrictEqual(
        new ForbiddenException(ResMessage.NOT_AUTHOR),
      );
      expect(postRepositorySpy).toHaveBeenCalledWith({ id: postId });
    });

    it('should delete post', async () => {
      // given
      const postId = 1;

      const postRepositorySpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(post);
      jest.spyOn(service, 'checkIsAuthor');
      const postDeleteSpy = jest.spyOn(postRepository, 'delete');

      // when
      await service.deletePost(postId, user);

      // then
      expect(postRepositorySpy).toHaveBeenCalledWith({ id: postId });
      expect(postDeleteSpy).toHaveBeenCalledWith(postId);
    });
  });
});
