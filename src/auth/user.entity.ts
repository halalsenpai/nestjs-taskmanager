import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/entities/task.entity';
import * as _ from 'lodash';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  salt: string;

  @Column({ default: false })
  madeWithGoogle: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  async sanitize(): Promise<User> {
    const user = await _.omit(this, ['password', 'salt']);
    return user;
  }
}
