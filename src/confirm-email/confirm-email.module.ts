import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import EmailService from '../email/email.service';
import { ConfirmEmailController } from './confirm-email.controller';
import { ConfirmEmailService } from './confirm-email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [AuthModule],
  providers: [ConfirmEmailService, EmailService],
  controllers: [ConfirmEmailController],
})
export class ConfirmEmailModule {}
