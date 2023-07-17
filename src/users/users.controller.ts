import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
    private usersService: UsersService;

    constructor(usersService: UsersService) {
        this.usersService = usersService;
    }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        //Create user logic
        this.usersService.create(body.email, body.password);
    }
}
