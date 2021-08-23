import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';

import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { GoogleStrategy } from './google.strategy';
import { EmailModule } from '../email/email.module';
import { EmailConfirmationService } from '../email/email-confirmation.service';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
    EmailModule,
  ],
  providers: [
    AuthService,
    JwtAuthStrategy,
    GoogleStrategy,
    EmailConfirmationService,
  ],
  exports: [JwtModule, TypeOrmModule],
})
export class AuthModule {}
