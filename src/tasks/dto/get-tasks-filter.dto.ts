import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../task.model';
export class getTasksFilterDTO {

    @IsOptional()
    @IsIn([TaskStatus.DONE, TaskStatus.PENDING, TaskStatus.OPEN])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}