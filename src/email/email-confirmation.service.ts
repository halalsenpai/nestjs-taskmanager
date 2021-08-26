import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import EmailService from './email.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: 'secret',
      expiresIn: `1000s`,
    });

    const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }
  public sendMagicLink(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: 'magic-link',
      expiresIn: `10s`,
    });

    const url = `${process.env.MAGIC_LINK_URL}?token=${token}`;

    const text = `Welcome to the application. To log in, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Magic Link To login',
      text,
    });
  }
  public passwordReset(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: 'secret',
      expiresIn: `1000s`,
    });

    const url = `${process.env.PASSWORD_RESET_URL}?token=${token}`;

    const text = `To reset the password, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Password Reset',
      text,
    });
  }
}
