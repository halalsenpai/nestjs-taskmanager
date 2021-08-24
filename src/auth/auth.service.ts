import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private UserRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    return this.UserRepository.signUp(authCredentialsDto);
  }

  async login(authCredentialsDto: AuthCredentialsDto) {
    const email = await this.UserRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!email) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    if (email) {
      const payload: JwtPayload = { email };
      const accessToken = await this.jwtService.sign(payload);

      return accessToken;
    }
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    const found = await this.UserRepository.findOne({ email: req.user.email });

    if (found) {
      const payload: JwtPayload = { email: found.email };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      return this.createWithGoogle(req.user.email, true);
    }
  }

  async createWithGoogle(email: string, madeWithGoogle: boolean) {
    return await this.UserRepository.signUpWithGoogle(email, madeWithGoogle);
  }
}
