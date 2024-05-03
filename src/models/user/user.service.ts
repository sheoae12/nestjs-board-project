import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { UpdateNicknameDto } from './dto/req.dto';
import { ResMessage } from 'src/common/message/res-message';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(private userRepository: UserRepository) {}

  async getUserInfo(userId: number) {
    const findUser = await this.userRepository.findOneBy({ id: userId });

    if (!findUser) throw new NotFoundException(ResMessage.USER_NOT_FOUND);
    return findUser;
  }

  async updateNickname(payload: UpdateNicknameDto) {
    const { nickname, userId } = payload;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(ResMessage.USER_NOT_FOUND);

    const existingNickname = await this.userRepository.findOneBy({ nickname });
    if (existingNickname)
      throw new ConflictException('nickname already in use');

    try {
    } catch (error) {
      this.logger.error('updateNickname::', error, error.stack);
      throw new InternalServerErrorException(ResMessage.SERVER_ERROR);
    }
  }
}
