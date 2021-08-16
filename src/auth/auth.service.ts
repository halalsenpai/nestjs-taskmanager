import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private UserRepository: UserRepository,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    return this.UserRepository.signUp(authCredentialsDto);
  }

  async login(authCredentialsDto: AuthCredentialsDto) {
    const result = await this.UserRepository.validateUserPassword(
      authCredentialsDto,
    );
    return result;
  }
}
