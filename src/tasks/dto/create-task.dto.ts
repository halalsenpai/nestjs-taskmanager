
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateTaskDto {
    @ApiProperty({type:String, description:'task title', example:'title 1' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({type:String, description:'task description', example:'description'})
    @IsNotEmpty()
    description: string;
}