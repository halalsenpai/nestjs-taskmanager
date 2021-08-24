import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;

    const user = new User();
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.madeWithGoogle = false;

    try {
      await user.save();
      return { user: email };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { email, password } = authCredentialsDto;

    const user = await this.findOne({ email });

    console.log('user found', user);

    if (user && (await user.validatePassword(password))) {
      return user.email;
    } else {
      return null;
    }
  }
  async signUpWithGoogle(email: string, madeWithGoogle: boolean) {
    const user = new User();
    user.email = email;
    user.madeWithGoogle = madeWithGoogle;
    user.password = null;
    user.salt = null;

    try {
      await user.save();
    } catch (error) {
      return error;
    }
  }
  async markEmailAsConfirmed(email: string) {
    return this.update({ email }, { isVerified: true });
  }

  async getUser(email: string) {
    return this.findOne({ email });
  }
}
