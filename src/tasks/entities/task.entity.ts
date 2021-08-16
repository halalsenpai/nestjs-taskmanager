import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
}
