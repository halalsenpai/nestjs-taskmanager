import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Req,
  Response,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
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
import * as csurf from 'csurf';

var csrfProtection = csurf({ cookie: true });

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(
    @Request() req,
    @Query(ValidationPipe) filterDTO: getTasksFilterDTO,
  ): any {
    if (Object.keys(filterDTO).length) {
      return this.tasksService.getTasksWithFilters(filterDTO);
    } else {
      return { taks: this.tasksService.getAllTasks(), token: req.csrfToken() };
    }
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create a task' })
  @ApiBody({ type: CreateTaskDto })
  createTask(@Request() req, @Body() createTaskDto: CreateTaskDto): Task[] {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Req() req, @Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Task[] {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/status/:id')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task[] {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
