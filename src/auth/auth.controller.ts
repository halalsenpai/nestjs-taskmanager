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
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
    console.log(authCredentialsDto);
    this.authService.signUp(authCredentialsDto);
  }
}
