import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';

import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([UserRepository]),],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
