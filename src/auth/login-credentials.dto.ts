
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class LoginCredentialsDto {
    @ApiProperty({type:String, description:'username', example:'john' })
    @IsNotEmpty()
    username: string;

    @ApiProperty({type:String, description:'password', example:'12345678'})
    @IsNotEmpty()
    password: string;
}