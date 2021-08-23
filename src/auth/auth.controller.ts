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
    private authService: AuthService,
    private userRepository: UserRepository,
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
  @Post('/forgotpassword')
  async resetPassword(@Body(ValidationPipe) body): Promise<any> {
    console.log(body.email);
    const user = await this.userRepository.findOne({ email: body.email });
    if (user) {
      await this.emailConfirmationService.passwordReset(body.email);
    } else {
      throw new BadRequestException('user doesnt exist');
    }
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
}
