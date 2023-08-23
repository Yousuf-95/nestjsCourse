import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common'
import { UpdateUserDto } from './dtos/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  // Create a fake copy of UsersService
  fakeUsersService = {
    findOne: (id: number) => Promise.resolve({ id, email: 'abc@email.com', password: 'abcdefg' } as User),
    find: (email: string) => Promise.resolve([{ id: 1, email, password: 'abcdefg' } as User]),
    remove: (id: number) => Promise.resolve({ id, email: 'abc@email.com', password: 'abcdefg' } as User),
    update: (id: number, body: UpdateUserDto) => {
      const userObject = {
        id,
        ...body
      }

      return Promise.resolve(userObject as User)
    }
  }

  // create a fake copy of AuthService
  fakeAuthService = {
    // signup: () => {},
    signin: (email: string, password: string) => {
      return Promise.resolve({id: 1, email, password} as User);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUseres returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('abc@email.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('abc@email.com');
  });

  it('findUser returns a single user with a given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signIn updates session and returns user', async () => {
    const session = { userId: 99 };
    const user = await controller.signin({ email: 'abc@email.com', password: 'abcdefg' }, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('updateUser function updates a user', async () => {
    const userDetailsToUpdate = {
      email: 'wxyz@email.com'
    }

    const user = await controller.updateUser('1', userDetailsToUpdate as UpdateUserDto);
    expect(user.email).toEqual('wxyz@email.com');
  })
});
