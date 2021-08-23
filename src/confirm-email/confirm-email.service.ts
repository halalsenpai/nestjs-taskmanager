import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EmailService from '../email/email.service';
import { UserRepository } from '../auth/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ConfirmEmailService {
  constructor(
    @InjectRepository(UserRepository)
    private UserRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  public async confirmEmail(email: string) {
    console.log('email in confirm email service', email);
    const user = await this.UserRepository.findOne({ where: { email: email } });

    if (user.isVerified) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.UserRepository.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: 'secret',
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
