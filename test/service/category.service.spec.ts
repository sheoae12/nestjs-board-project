import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { ResMessage } from 'src/common/message/res-message';
import { PostCategory } from 'src/entities/category.entity';
import { CategoryService } from 'src/module/category/category.service';
import { CreateCategoryDto } from 'src/module/category/dto/req.dto';
import { CategoryRepository } from 'src/repositories/category.repository';
import { DataSource } from 'typeorm';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: CategoryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: CategoryRepository,
          useValue: {
            findTrees: jest.fn(),
            findOneBy: jest.fn(),
            findBy: jest.fn(),
            existsBy: jest.fn(),
            save: jest.fn(),
            getChilds: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategory', () => {
    it('should return all categories', async () => {
      // given
      const treeResult: PostCategory[] = [
        plainToInstance(PostCategory, { id: 1, text: 'cat1' }),
        plainToInstance(PostCategory, { id: 2, text: 'cat2' }),
      ];

      jest.spyOn(service, 'getCategory').mockResolvedValue(treeResult);

      // when
      const result = await service.getCategory();

      // then
      expect(result).toBe(treeResult);
    });
  });

  describe('createCategory', () => {
    it('should throw error if parent category not exist', async () => {
      // given
      const input = plainToInstance(CreateCategoryDto, {
        text: 'category',
        parent: 9999,
      });

      const parentCheckSpy = jest
        .spyOn(categoryRepository, 'existsBy')
        .mockResolvedValue(false);

      // when, then
      expect(service.createCategory(input)).rejects.toStrictEqual(
        new BadRequestException(ResMessage.CATEGORY_NOT_FOUND),
      );
      expect(parentCheckSpy).toHaveBeenCalledWith({ id: input.parent });
    });

    it('should throw error if category already exist', async () => {
      // given
      const input = { text: 'dulicate', parent: 1 };

      const parentCheckSpy = jest
        .spyOn(categoryRepository, 'existsBy')
        .mockResolvedValue(true);
      const duplicateCheckSpy = jest
        .spyOn(categoryRepository, 'findOneBy')
        .mockResolvedValue(
          plainToInstance(PostCategory, {
            text: 'duplicate',
            parent: { id: 1 },
          }),
        );

      // when, then
      expect(service.createCategory(input)).rejects.toStrictEqual(
        new ConflictException(ResMessage.DUPLICATE_CATEGORY),
      );
      expect(parentCheckSpy).toHaveBeenCalledWith({ id: input.parent });
      expect(duplicateCheckSpy).toHaveBeenCalled();
      //expect(duplicateCheckSpy).toHaveBeenCalledWith({ text: input.text });
    });

    it('should create new category', async () => {
      // given
      const input = { text: 'category', parent: 1 };

      const parentCheckSpy = jest
        .spyOn(categoryRepository, 'existsBy')
        .mockResolvedValue(true);
      const duplicateCheckSpy = jest
        .spyOn(categoryRepository, 'findOneBy')
        .mockResolvedValue(null);
      const saveSpy = jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValue(plainToInstance(PostCategory, input));

      // when
      await service.createCategory(plainToInstance(CreateCategoryDto, input));

      // then
      expect(parentCheckSpy).toHaveBeenCalledWith({ id: input.parent });
      expect(duplicateCheckSpy).toHaveBeenCalledWith({ text: input.text });
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('should throw error if category not exist', async () => {});

    it('should throw error if category is a root', async () => {});

    it('should throw error if category in-use', async () => {});

    it('should delete category', async () => {});
  });
});
