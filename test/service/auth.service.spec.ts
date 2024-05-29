import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/models/auth/auth.service';
import { UserRepository } from 'src/repositories/user.repository';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
