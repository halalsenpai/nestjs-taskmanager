import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { getTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UsePipes } from '@nestjs/common';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from './consts';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }
    
    @Get()
    getAllTasks(@Query(ValidationPipe) filterDTO: getTasksFilterDTO): Task[] {
        if (Object.keys(filterDTO).length) {
            return this.tasksService.getTasksWithFilters(filterDTO);
        }
        else {
            return this.tasksService.getAllTasks();
        }
    }

    @Post()
    @UsePipes(ValidationPipe)
    @ApiOperation({ summary: 'Create a task' })
    @ApiBody({type: CreateTaskDto})
    createTask(@Body() createTaskDto: CreateTaskDto): Task[] {
        return this.tasksService.createTask(createTaskDto)
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id)
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): Task[] {
        return this.tasksService.deleteTaskById(id)
    }

    @Patch('/status/:id')
    updateTaskStatus(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Task[] {
        return this.tasksService.updateTaskStatus(id, status)
    }
}
