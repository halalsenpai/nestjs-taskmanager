import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { LoginCredentialsDto } from './login-credentials.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from '../tasks/consts';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBody({ type: LoginCredentialsDto })
  @Post('auth/login')
  async login(@Request() req) {
    console.log(req.user);
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
