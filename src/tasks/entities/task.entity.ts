import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({ example: 'task 1', description: 'The title of the task' })
  title: string;

  @ApiProperty({
    example: 'This is a test description',
    description: 'The description of the task',
  })
  description: string;
}
