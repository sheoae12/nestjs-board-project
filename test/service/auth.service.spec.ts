import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { ResMessage } from 'src/common/message/res-message';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/module/auth/auth.service';
import { UserRepository } from 'src/repositories/user.repository';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  const createdUser = plainToInstance(User, {
    email: 'user@test.com',
    password: '$2b$10$ML7yOOSBL3bnh91ib3WxqOjU6W.ij59.etnRvU7TuSqSsdX9a5Lwm',
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw error if email exist', async () => {
      // given
      const payload = {
        email: 'duplicate_user@test.com',
        password: '@3!pwd!#',
      };

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(plainToInstance(User, payload));

      // when, then
      expect(service.signUp(payload)).rejects.toStrictEqual(
        new ConflictException(ResMessage.DUPLICATE_USER),
      );
    });

    it('should create user', async () => {
      // given;
      const payload = {
        email: 'user@test.com',
        password: '@3!pwd!#',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      const userRepositorySpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(createdUser);

      //when;
      const result = await service.signUp(payload);

      //then;
      expect(userRepositorySpy).toHaveBeenCalled();
      expect(result).toBe(createdUser);
    });
  });

  describe('signIn', () => {
    it('should throw error if user not exist', async () => {
      // given
      const payload = {
        email: 'none@test.com',
        password: '@3!pwd!#',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      // when, then
      expect(service.signIn(payload)).rejects.toStrictEqual(
        new BadRequestException(ResMessage.USER_NOT_FOUND),
      );
    });

    it('should throw error if password mismatch', async () => {
      // given
      const payload = {
        email: createdUser.email,
        password: '@3!wrong!#',
      };

      const userRepositorySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(createdUser);

      // when, then
      expect(service.signIn(payload)).rejects.toStrictEqual(
        new UnauthorizedException(ResMessage.PASSWORD_MISMATCH),
      );
      expect(userRepositorySpy).toHaveBeenCalledWith({ email: payload.email });
    });

    it('should return jwt tokens', async () => {
      // given
      const payload = {
        email: createdUser.email,
        password: '@3!pwd!#',
      };

      const userRepositorySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(createdUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      // when
      const result = await service.signIn(payload);

      // then
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(userRepositorySpy).toHaveBeenCalledWith({ email: payload.email });
    });
  });

  describe('withdrawUser', () => {
    it('should throw error if user not exist', async () => {
      // given
      const userId = 9999;

      const userRepositorySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(null);

      // when, then
      expect(service.withdrawUser(userId)).rejects.toStrictEqual(
        new BadRequestException(ResMessage.USER_NOT_FOUND),
      );
      expect(userRepositorySpy).toHaveBeenCalledWith({ id: userId });
    });

    it('should delete user', async () => {
      // given
      const userId = 1;

      const userRepositorySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(createdUser);
      const userDeleteSpy = jest.spyOn(userRepository, 'delete');

      // when
      await service.withdrawUser(userId);

      // then
      expect(userRepositorySpy).toHaveBeenCalledWith({ id: userId });
      expect(userDeleteSpy).toHaveBeenCalledTimes(userId);
    });
  });
});
