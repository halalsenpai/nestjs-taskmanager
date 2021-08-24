import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { getTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UsePipes } from '@nestjs/common';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(
    @Query(ValidationPipe) filterDTO: getTasksFilterDTO,
    @Request() request,
  ) {
    return this.tasksService.getAllTasks(filterDTO);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create a task' })
  @ApiBody({ type: CreateTaskDto })
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    console.log('User===>', user);
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: number): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/status/:id')
  updateTaskStatus(
    @Param('id') id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
