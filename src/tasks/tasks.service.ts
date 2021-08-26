import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';
import { getTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { UserRepository } from '../auth/user.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  getAllTasks(filterDto: getTasksFilterDTO): Promise<Task[]> {
    return this.taskRepository.getAllTasks(filterDto);
  }

  async getTaskById(id: number) {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const getUser = await (
      await this.userRepository.getUser(user.email)
    ).sanitize();

    return this.taskRepository.createTask(createTaskDto, getUser);
  }

  async deleteTaskById(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    console.log('result===>', result);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
