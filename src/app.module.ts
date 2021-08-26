import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleStrategy } from './auth/google.strategy';
import { EmailModule } from './email/email.module';
import { ConfirmEmailService } from './confirm-email/confirm-email.service';
import { ConfirmEmailController } from './confirm-email/confirm-email.controller';
import { ConfirmEmailModule } from './confirm-email/confirm-email.module';
import { JwtAuthStrategy } from './auth/jwt-auth.strategy';
import { AuthService } from './auth/auth.service';
import { EmailConfirmationService } from './email/email-confirmation.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'halalsenpai',
      password: '959804',
      database: 'taskmanagement',
      synchronize: true,
      autoLoadEntities: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    TasksModule,
    AuthModule,
    EmailModule,
    ConfirmEmailModule,
  ],
  providers: [
    GoogleStrategy,
    ConfirmEmailService,
    JwtAuthStrategy,
    AuthService,
    EmailConfirmationService,
  ],
  controllers: [ConfirmEmailController],
})
export class AppModule {}
