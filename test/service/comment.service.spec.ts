import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from 'src/models/comment/comment.service';
import { CommentRepository } from 'src/repositories/comment.repository';
import { DataSource } from 'typeorm';

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
