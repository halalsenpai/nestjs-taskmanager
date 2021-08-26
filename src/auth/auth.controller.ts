import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  Req,
  Res,
  Redirect,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { EmailConfirmationService } from '../email/email-confirmation.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { BadRequestException } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private authService: AuthService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<any> {
    const user = await this.authService.signUp(authCredentialsDto);
    await this.emailConfirmationService.sendVerificationLink(
      authCredentialsDto.email,
    );
    return user;
  }
  @Post('/login')
  login(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.login(authCredentialsDto);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
  @Post('/forgot-password')
  async resetPassword(@Body(ValidationPipe) body): Promise<any> {
    return this.authService.forgotPassword(body);
  }
  @Post('/reset-password')
  async newPassword(@Body(ValidationPipe) body): Promise<any> {
    const { oldPassword, NewPassword } = body;
    const user = await this.userRepository.findOne({ email: body.email });
    if (user) {
      await this.emailConfirmationService.passwordReset(body.email);
    } else {
      throw new BadRequestException('user doesnt exist');
    }
  }

  @Post('/sign-up-magic-link')
  async signUpWithMagicLink(@Body(ValidationPipe) body): Promise<any> {
    return this.authService.signUpWithMagicLink(body.email);
  }
  @Get('/verify-token')
  async loginMagicLink(@Request() req) {
    console.log('Request===> ', req.query.token);
    return this.authService.verifyMagicLinkToken(req.query.token);
  }
}
