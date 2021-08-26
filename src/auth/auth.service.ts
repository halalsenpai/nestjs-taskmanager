import {
  BadRequestException,
  Body,
  Injectable,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

import { UserRepository } from './user.repository';
import { EmailConfirmationService } from '../email/email-confirmation.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private UserRepository: UserRepository,
    private jwtService: JwtService,
    private emailConfirmationService: EmailConfirmationService,
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
  async forgotPassword(@Body(ValidationPipe) body) {
    const user = await this.UserRepository.findOne({ email: body.email });
    if (user) {
      await this.emailConfirmationService.passwordReset(body.email);
    } else {
      throw new BadRequestException('user doesnt exist');
    }
  }
  async signUpWithMagicLink(email: string) {
    const user = await this.UserRepository.findOne({ email: email });
    if (user) {
      return this.emailConfirmationService.sendMagicLink(email);
    } else {
      await this.UserRepository.createUserWithMagicLink(email);
      return this.emailConfirmationService.sendMagicLink(email);
    }
  }

  async verifyMagicLinkToken(token: string) {
    try {
      const tok = await this.jwtService.verify(token, { secret: 'magic-link' });
      console.log('token from magic link', tok.email);
    } catch (error) {
      return error;
    }
  }
}
