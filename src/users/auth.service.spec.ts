import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {

        const users: User[] = [];

        // Create a fake copy of UsersService
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);

            },
            create: (email: string, password: string) => {
                const user = {id: Math.floor(Math.random()) * 999, email, password} as User;
                users.push(user);
                return Promise.resolve(user);
            },
        }

        const module = await Test.createTestingModule({
            providers: [AuthService, { provide: UsersService, useValue: fakeUsersService }]
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });


    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('abc@gmail.com', 'abcdefg');
        expect(user.password).not.toEqual('abcdefg');
        const [salt, hash] = user.password.split('.');
        console.log(salt, hash);
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('thorws an error if user signs up with email that is in use', async () => {
        await service.signup('abc@email.com', 'abcdefg');

        await expect(service.signup('abc@email.com', 'abcdefg')).rejects.toThrow(BadRequestException);
    });

    it('throws an error if user signs in with unused email', async () => {
        await expect(service.signin('abc@email.com', 'abcdefg')).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
         await service.signup('abc@email.com', 'abcdefg');

         await expect(service.signin('abc@email.com', 'abcdef')).rejects.toThrow(BadRequestException);
    });

    it('returns a user if correct password is provided', async () => {
        await service.signup('test4@email.com', 'testPassword');

        const user = await service.signin('test4@email.com', 'testPassword');
        expect(user).toBeDefined();
    });

});