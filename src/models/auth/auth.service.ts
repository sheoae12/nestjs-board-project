import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';
import { SignInDto, SignUpDto } from './dto/req.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResMessage } from 'src/common/message/res-message';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(payload: SignUpDto) {
    const { email, password } = payload;

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) throw new ConflictException(ResMessage.DUPLICATE_USER);

    const user = plainToInstance(User, payload);

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error('signUp::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }

  async signIn(payload: SignInDto) {
    const { email, password } = payload;

    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new BadRequestException(ResMessage.USER_NOT_FOUND);

    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword)
      throw new UnauthorizedException(ResMessage.PASSWORD_MISMATCH);

    const tokenPayload = { sub: user.id, username: user.email };

    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async withdrawUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new BadRequestException(ResMessage.USER_NOT_FOUND);

    try {
      await this.userRepository.delete(userId);
    } catch (error) {
      this.logger.error('withdrawUser::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }
}
