import { ConfirmEmailService } from './confirm-email.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';

@Controller('confirm-email')
@UseInterceptors(ClassSerializerInterceptor)
export class ConfirmEmailController {
  constructor(private readonly emailConfirmationService: ConfirmEmailService) {}

  @Post('confirm')
  async confirm(@Body() confirmationData) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.emailConfirmationService.confirmEmail(email);
  }
}
