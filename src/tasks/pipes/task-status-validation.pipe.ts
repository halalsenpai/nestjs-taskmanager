import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        TaskStatus.OPEN, TaskStatus.PENDING, TaskStatus.DONE,
    ];
    transform(value: any) {
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid status`)
        }
        return value;
    }
    private isStatusValid(status: any) {
        const idx = this.allowedStatus.indexOf(status);
        return idx !== -1
    }
}