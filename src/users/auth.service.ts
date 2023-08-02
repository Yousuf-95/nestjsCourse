import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor (private usersService: UsersService) {}


    async signup(email: string, password: string) {
        // see if email already exists
        const users = await this.usersService.find(email);
        if(users.length) {
            throw new BadRequestException('email already in use');
        }

        // Hash user password


        // create new user and save


        // return the user
    }

    signin() {

    }
}