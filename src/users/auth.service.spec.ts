import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of UsersService
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
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
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'abs@email.com', password: 'abcdefg' } as User]);

        await expect(service.signup('abc@email.com', 'abcdefg')).rejects.toThrow(BadRequestException);
    });

    it('throws an error if user signs in with unused email', async () => {
        await expect(service.signin('abc@email.com', 'abcdefg')).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
         fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'abc@email.com', password: 'abcdefg.'} as User]);

         await expect(service.signin('abc@email.com', '121')).rejects.toThrow(BadRequestException);
    });

    it('returns a user if correct password is provided', async () => {
        fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'test4@email.com', password: 'b37e080dcda682b5.f9dce685a95608b5f4ba1d4691ba471002951b6d7ffe5af388aa659089096588'} as User]);

        const user = await service.signin('test4@email.com', 'testPassword');
        expect(user).toBeDefined();
    });

});