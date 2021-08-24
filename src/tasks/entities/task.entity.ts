import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from '../task-status.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ example: 'task 1', description: 'The title of the task' })
  title: string;

  @Column()
  @ApiProperty({
    example: 'This is a test description',
    description: 'The description of the task',
  })
  description: string;

  @Column()
  @ApiProperty({ example: 'PENDING' })
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
