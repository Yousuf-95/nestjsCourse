|No.|Section|
|---|-------|
|1|Section 1: Getting started|
|3|[Section 2: The basics of Nest](#section-2)|
|3|[Section 3: Generating projects with Nest CLI](#section-3)|
|4|[Section 4: Validating request data with pipes](#section-4)|
|5|[Section 5: Nest Architecture: Services and repositories](#section-5)|
|6|[Section 6: Nest Architecture: Organizing code with modules](#section-6)|
|7|[Section 7: Big project (Car value estimate project)](#section-7)|
|8|[Section 8: Persisting data with TypeORM](#section-8)|
|9|[Section 9: Creating and saving user data](#section-9)|
|10|[Section 10: Custom data serialization](#section-10)|
|11|[Section 11: Authentication from scratch](#section-11)|
|12|[Section 12: Getting started with unit testing](#section-12)|
|13|[Section 13: Integration testing](#section-13)|
|14|[Section 14: Managing app configuration](#section-14)|
|15|[Section 15: Relations with TypeORM](#section-15)|
|16|[Section 16: A basic permissions system](#section-16)|
|17|[Section 17: Query builders with TypeORM](#section-17)|
|18|[Section 18: Production deployment](#section-18)|
|19|Section 19: [Bodnus] Appendix: TypeScript|

## Section 2

### NestJS dependencies:
1. @nestjs/common<br>
   Contains majority of functions, classes that we need from Nest

2. @nestjs/platform-express<br>
   Lets Nest use ExpressJS to handle HTTP request

3. reflect-metadata<br>
   Helps make decorators work.

4. typescript<br>
   Most Nest apps are written in TypeScript.

### Parts of NestJS

1. **Controllers:** Handles incoming requests.
2. **Services:** Handles data access and business logic.
3. **Modules:** Groups together code.
4. **Pipes:** Validates incoming data.
5. **Filters:** Handles errors that occurs during error handling.
6. **Guards:** Handles authentication.
7. **Interceptors:** Adds extra logic to incoming requests or outgoing responses.
8. **Repositories:** Handles data stored in a DB.

## Section 3
### Some Nest CLI commands

1. Create a new project     
   ```bash
   # create a new project with name: "projectName"
   nest new projectName

   # create a new project within the directory you are present in
   nest new .
   ```

2. Create a new module
   ```bash
   # create a new module with the name - 'messages'
   nest generate module messages
   ```
   The output of the above command will be a folder named 'messages' and a file within the folder with the name 'messages.module.ts'. This file will export a module named 'MessagesModule'.

   <code>Tip:</code> Donot create a module with name <code>messagesModule</code> as nest cli will automatically append <code>modules</code> to the name given in the command.

3. Create a new controller
   ```bash
   # create a new controller inside 'messages' folder with the name 'messages'.
   # '--flat' is a flag used when we donot want to create extra folder, here it will be - 'controllers'  
   nest generate controller messages/messages --flat
   ```
   <code>Tip:</code> Donot create a controller with name <code>messagesController</code> as nest cli will automatically append <code>controller</code> to the name given in the command.


**General pattern of nest command:**
```bash
nest generate (type of class to generate) (folder name/name of file) (flags)
```

## Section 4

### Setup validation in NestJS

1. Tell nest to use global validation.
   ```TS
   // main.ts
   const app = await NestFactory.create(MessagesModule);
      app.useGlobalPipes(
      new ValidationPipe()
   );
   ```
2. Create a class that describes the different properties that the request body should have.
   ```TS
   // create-message.dto.ts
   export class CreateMessageDto {
      content: string;
   }
   ```
3. Add validation rules to the class.
   ```TS
   // create-message.dto.ts
   import { IsString } from 'class-validator';
   
   export class CreateMessageDto {
      @IsString()
      content: string;
   }
   ```
4. Apply that class to the request handler.
   ```TS
   // messages.controller.ts
   
    @Post()
    createMessage(@Body() body: CreateMessageDto) {
        // perform request operations here...
    }
   ```

## Section 5

### Services and Repositories in Nestjs

**Repositories:** Repositories are classes or components that encapsulate the logic required to access data sources. They centralize common data access functionality, providing better maintainability and decoupling the infrastructure or technology used to access databases from the domain model layer.

**Services:** Services is a class that uses one or more repositories to find or store data. 

### Difference between services and repositories:

![Difference between Services and Repositories](notesResources/Section5_1.png)

### Service and repository class mapping (in general):
![Service and Repository class](notesResources/Section5_2.png)

### Inversion of Control principle and Dependency Injection (DI) Pattern:
The Inversion-of-Control (IoC) pattern, is about providing any kind of callback, which "implements" and/or controls reaction, instead of acting ourselves directly (in other words, inversion and/or redirecting control to the external handler/controller).<br>
Dependency injection is an inversion of control (IoC) technique wherein you delegate instantiation of dependencies to the IoC container (in our case, the NestJS runtime system), instead of doing it in your own code imperatively.

![Inversion of control principle](notesResources/Section5_3.png)

> Bad way to write code according to inversion of control principle:
```TS
export class MessagesService {
  messagesRepo: MessagesRepository;
  constructor() {
    // DONT DO THIS IN REAL APP. Use dependency injection instead.
    this.messagesRepo = new MessagesRepository();
  }
}
```

> Better Way to write the above code:
```TS
export class MessagesService {
    messagesRepo: MessagesRepository;

    constructor(messagesRepo: MessagesRepository) {
        this.messagesRepo = messagesRepo;
    }
}
```

> Best way to write above code
```TS
interface Repository {
  findOne(id: string);
  findAll();
  create(content: string);
}
export class MessagesService {
  messagesRepo: Repository;
  constructor(repo: Repository) {
    this.messagesRepo = repo;
  }
}
```
![Why the 'Good' case is good](notesResources/Section5_4.png)

Why the last case is actually good...

In the 'better' way to write code, we pass the 'MessagesRepository' itself as the dependency when initializing the class, but in case of 'best' way of writing the code, we just want the repository to have to conform to a specific interface. In this way, we can migrate to a different database if we wanted to, just by plugging in the repository of the new database that conforms to the interface. We can also write different code for the repository for testing and production environments.


![DI Container](notesResources/Section5_5.png)

The DI container instantiates dependencies of each class for us and makes sure only one instance of the dependency is created and will use that instance for instantiating other classes, if required.

![DI container flow](notesResources/Section5_6.png)

## Section 6
In this section, we create a small project to understand the concept of 'DI' (Dependency Injection) between modules.

This project imitates a computer with four different modules for each part of the computer.

![Computer model](notesResources/Section6_1.png)

Project architecture:

![Project diagram](notesResources/Section6_2.png)

For this project, we need to share code between different modules as shown in image below:

![Share code between modules](notesResources/Section6_3.png)

Steps for sharing code inside of a module:

![DI inside a module](notesResources/Section6_4.png)

Steps for sharing code between modules:

![DI between modules](notesResources/Section6_5.png)

## Section 7
In this section, we will start with building an API that is used to report pricing of used cars.

![API features](notesResources/Section7_1.png)

API routes (More routes will be added in future):

![API routes 1](notesResources/Section7_2.png)

Modules, controllers, services and repositories for this project:

![Modules, controllers, services and repositories](notesResources/Section7_3.png)

## Section 8

Nest provides tight integration with TypeORM and Sequelize out-of-the-box with the <code>@nestjs/typeorm</code> and <code>@nestjs/sequelize</code> packages respectively and Mongoose with <code>@nestjs/mongoose</code>. These integrations provide additional NestJS-specific features, such as model/repository injection, testability, and asynchronous configuration to make accessing the chosen database even easier. For ease of setup, this project will initially use SQLite and will eventually migrate to PostgreSQL.

![TypeORM](notesResources/Section8_1.png)

Connection to the database will be made in App Module and will be shared across all the modules (users and reports module). Inside of each module (except App module), an entity file should be created. An entity defines a single resource to store in database (just like schema in Mongoose).

![Database cennection diagram](notesResources/Section8_2.png)

### Setting up database connection in App module:

```TS
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [],
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
```

### Steps to create an entity:

![Steps to create an entity](notesResources/Section8_3.png)

**Step 1: Create an entity file:**
```TS
// users/user.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;
}
```

**Step 2: Update the module the entity belongs to:**
```TS
// users/users.module.ts

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
```

**Step 3: Update App module:**
```TS
// app.module.ts

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
// import ...

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
```

### Extra routes for the app:

![Extra routes](notesResources/Section8_4.png)
![Extra routes2](notesResources/Section8_5.png)

## Section 9

### Current flow of the signup request:

![signup request flow](notesResources/Section9_1.png)

### Difference between <code>create</code> and <code>save</code> methods in repository.

|Create|Save|
|------|----|
|<code>Create</code> method creates an instance of an entity (just like in mongoose, an instance of a model is created with the <code>new</code> keyword). |<code>Save</code> method saves the data to the database |

![create and save method](notesResources/Section9_2.png)

### Benefits of inserting data using <code>create</code> and <code>save</code> method instead of just passing an object directly to <code>save</code> method:
```TS
const user = this.repo.create({ email, password });
this.repo.save(user);

// VS

this.repo.save({ email, password });
```

| Using create & save | Using save only |
|-----------------|------|
|In this method, we can use TypeORM's built-in hooks to perform operation after inserting data into database| In this method, we have to build all features from scratch |

Handling exceptions:
In this case, there is a users controller that communicates over HTTP with the client and throwing a <code>NotFoundException</code> from users service back to the controller will work because <code>NotFoundException</code> works only with HTTP protocol. If we have a controller that communicates over WebSocket or gRPC, then NotFoundException won't work. In this case, we will have to use exception filters for WebSocket or gRPC. Nest has <code>WsException</code> class for WebSocket protocol.

![Exception handling](notesResources/Section9_3.png)

## Section 10

### Excluding properties from response

In this case, we remove 'password' property from 'user' entity.

Current request/response flow:

![request response flow](notesResources/Section10_1.png)

### Method 1: Official method recommended by NestJS

![first method for removing properties from entities](notesResources/Section10_2.png)

**Step 1: Add <code>Exclude</code> decorator to the property we want to exclude from the response**
```TS
// user.entity.ts
import { Exclude } from 'class-transformer';

@Exclude()
password: string;
```

**Step 2: Add interceptors**
```TS
// users.controller.ts
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/core'

@UseInterceptors(ClassSerializerInterceptor)
@Get('/auth/:id')
async findUser(@Param('id') id: string)
// ...
```

### Drawback of using the 1st (nest recommended) method for excluding properties from response:

For example, we have two types of routes, one for admins and other is a public route for querying information of a user. We want admin users to view all information about a user and limit it for a normal user. With the first method discussed above, this is just not possible as we have added a decorator in the user entity file to remove some fields from the response which cannot be customised based on different routes. This drawback can be solved by using a custom interceptor and DTOs (Data Transfer Objects).

![Different routes for admin and users](notesResources/Section10_3.png)

### Method 2: Using custom interceptor

![Interceptor diagram](notesResources/Section10_5.png)

![Interceptor application](notesResources/Section10_7.png)

![Custom interceptor class](notesResources/Section10_8.png)

![Custom interceptor solution](notesResources/Section10_4.png)

![Close-up view of interceptor solution](notesResources/Section10_6.png)

**Step 1: Create a dto**
```TS
// user.dto.ts
import { Expose } from 'class-transformer'

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;
}
```

**Step 2: Create custom interceptor**
```TS
// serialize.interceptor.ts
import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer'

interface ClassConstructor {
    new (...args: any[]): object
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    private dto: any; 

    constructor(dto: any) {
        this.dto = dto
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run something before a request is handled by the request handler.

        return next.handle().pipe(
            map((data: any) => {
                // Run something before response is sent out
                const result =  plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true
                });
                return result;
            })
        )
    }
}
```

**Step 3: Add the custom interceptor in controller file**
```TS
// users.controller.ts
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
      this.usersService.create(body.email, body.password);
  }
}
```

## Section 11

In this section, we will be implementing authentication for our application. There are two ways we can do this:
1. adding user authentication logic inside 'Users' service and 
2. creating a new 'Auth' service that depends on 'Users' service.

The drawback of first option is that, in future, we would want to add extra features like preferences, reset password and other features and all of this will be present in 'Users' service, making it a very large file. To prevent this, second option is preferred over first in large applications.

![Option 1 to implement auth](notesResources/Section11_1.png)

![Problem with option number 1](notesResources/Section11_3.png)

![Option 2 to implement auth](notesResources/Section11_2.png)

### Hierarchy of classes in users module:

In the diagram below, Auth Service imports Users service to access Users repository.

![Hierarchy of classes in users module](notesResources/Section11_4.png)

### Signup flow diagram:

![Signup flow diagram 1](notesResources/Section11_5.png)

![Signup flow diagram 2](notesResources/Section11_6.png)

### Signin flow diagram:
![Signin flow diagram](notesResources/Section11_7.png)


### Common auth system features
![Common auth system features](notesResources/Section11_8.png)


### Get signed in user with custom decorator and interceptor

**Step 1: Create a custom decorator:**
```TS
// src/users/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
});
```

**Step 2: Create an interceptor**
```TS
import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) { }

    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};
        if (userId) {
            const user = await this.usersService.findOne(userId);
            request.currentUser = user;
        }

        return next.handle();
    }
}
```

**Step 3: Connecting the interceptor**

There are two ways to connect the interceptor:
 1. **Connecting the interceptor to a specific controller:** <br>
    In this method, an interceptor can only intercept requests inside the current controller it is applied to. If we would like to use the interceptor in other controllers, we would have to import the interceptor in each of the controllers we wish to use it in and connect it to the controller. This can lead to code duplication and will make it harder to manage code. 

    ![Connecting interceptor to a controller](notesResources/Section11_9.png)

    **Steps to connect the interceptor to a controller:**

    **Step 1: Add the interceptor to the providers list of users module**
    ```TS
    // users.module.ts
    import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

    @Module({
      ...,
      providers: [..., CurrentUserInterceptor]
    })
    export class UsersModule { }
    ```

    **Step 2: Use the interceptor inside the controller**
    ```TS
    import { ..., UseInterceptors } from '@nestjs/common';
    import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

    @UseInterceptors(CurrentUserInterceptor)
    export class UsersController {
      ...
    }
    ```

 2. **Connecting the interceptor globally:** <br>
    In this method, the interceptor is used for the whole application, for each controller and route. One downside for this method is that the interceptor will perform its operation even if some of the controllers doesnot need its features.
   
    ![Connecting interceptor globally](notesResources/Section11_10.png)

    To connect the interceptor globally, add the interceptor inside the providers list of users module using APP_INTERCEPTOR

    ```TS
    // users.module.ts
    import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
    import { APP_INTERCEPTOR } from '@nestjs/core';

    @Module({
      ...,
      providers: [..., { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor }]
    });
    export class UsersModule { }
    ```

### Authentication guards<br>
Guards determine whether a given request will be handled by the route handler or not, depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time. A guard is a class annotated with the <code>@Injectable()</code> decorator, which implements the <code>CanActivate</code> interface. Every guard must implement a <code>canActivate()</code> function. This function should return a boolean, indicating whether the current request is allowed or not.

A gaurd can be applied to different locations as required by the application: 

![Guard usage](notesResources/Section11_11.png)

Create an auth guard:
```TS
// src/guards/augth.guard.ts
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        return request?.session?.userId;
    }
}
```

Use guard for a specific route in controller:
```TS
// src/users/users.controller.ts
import { ... , UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';

export class UsersController {
    ...

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }
}
```

## Section 12

### Types of testing: 

|Unit testing|Integration testing|
|------------|-------------------|
|Makes sure individual methos on a class are working correctly| Tests the full coverage of a feature|
|Testing files have <code>.spec</code> of <code>.test</code> suffix| Testing files have <code>.e2e-spec</code> suffix|
|Test files are placed near the classes they test| Test files are placed inside <code>test</code> directory|

### Testing <code>AuthService</code> class

To test AuthService class, we need to create an instance of this class to call methods inside it. Since AuthService class depends on UsersService class, we need its instance as well and since UsersService class depends on UsersRepository which in turn depends on SQLite and its configuration, we need to create all these dependencies which is time consuming. To overcome this, we create an instance of AuthService class by passing a fake UsersService class defined inside the test file that has only the methods we require while testing.

![Dependency hell](notesResources/Section12_1.png)

![Dependency hell solution](notesResources/Section12_2.png)

When app runs normally, DI container has a mapping of all classes and their dependencies. During testing we will create a testing DI container that has AuthService and our fake UsersService class.

![DI container in production](notesResources/Section12_4.png)

![DI container when testing](notesResources/Section12_5.png)


Test file for AuthService class
```TS
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

it('can create an instance of auth service', async () => {

    const fakeUsersService: Partial<UsersService> = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User)
    }

    const module = await Test.createTestingModule({
        providers: [AuthService, {provide: UsersService, useValue: fakeUsersService}]
    }).compile();

    const service = module.get(AuthService);

    expect(service).toBeDefined();
});
```

In the above code snippet, the providers array inside <code>createTestingModule</code>, has all the classes we want to register inside the DI container. Within providers array, we have AuthService and an object. The <code>provide</code> key inside the object means that if someone asks for a class mentioned against this key, give them the class mentioned against <code>useValue</code> key. In case above, the DI container will provide <code>fakeUsersService</code> whenever a class requires <code>UsersService</code>.

![DI container example](notesResources/Section12_7.png)

## Section 13

In an end-to-end test, entire workflow of the application is tested. End-to-end test mimics how software operates in real life by running common user scenarios and identifying any errors or malfunctions. In an end-to-end test, an entire instance of our nest app is created and listens to a random port on the computer and then makes request to this random port to test the feature. For every end-to-end test, a brand new test application is created, so if we have for example five tests, then five instances of the application will be created.

![End to end test](notesResources/Section13_1.png)


End-to-end test file for users controller

```TS
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', () => {
    const email = 'abc@email.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'abcdefg' })
      .expect(201)
      .then((res) => {
        const {id, email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      })
  });
});
```

During active development, both users module and reports module gets imported into the app module. App module is then imported into <code>main.ts</code> file and there we run a bootstrap funtion where we configure <code>cookie-session</code> middleware and validation pipe. 
During testing, app module is imported and an instance of the application is initialized without configuring the middleware and validation pipe. This results in the above signup test to fail as there is no session object to assign userId to. 

![Initializing app during active development](notesResources/Section13_2.png)

![Initializing app during end-to-end test](notesResources/Section13_3.png)

To fix the error occuring the in test due to middleware and validation pipe configuration, we move its configuration from <code>main.ts</code> file to <code>app.module.ts</code> file.

**Step 1: Remove validation pipe and middleware configuration in main.ts file. The file should look like as shown in code block below:**

```TS
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

**Step 2: Setup validation pipe in the provider list of app module decorator and middleware in the <code>AppModule</code> class.**

```TS
// app.module.ts

...
@Module({
  ...
  providers: [
       { 
         provide: APP_PIPE,
         useValue: new ValidationPipe({ whitelist: true })
       }
    ],
  })


export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({
        keys: ['cookieSession']
      })
    ).forRoutes('*');
  }
}
```

Error thrown if same test is run again.
Running the <code>/auth/signup (POST)</code> test again will throw a <code>400 Bad Request</code> error because the first run of the test created an account with an email and this email is used again hence, an error is thrown. This can be solved by using two databases one for development and other for testing. The testing database will be wiped out before running each test preventing any data leak between the tests.

![Create new instance of DB](notesResources/Section13_4.png)

To create a new database instance, we just have to change a single string inside app module. This can be changed by simply using the ternary operator with environment variables. This is not the recommended way of handling environment variables by Nestjs.

![TypeOrmModule property to change for database](notesResources/Section13_5.png)

```TS
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    }),
    ...
  ],
})
```

## Section 14

### Nest recommended way of handling environment variables is by using nest module - <code>@nestjs/config</code>

![Config service](notesResources/Section13_6.png)

```TS
// src/app.module.ts
...
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report]
        }
      }
    }),
    ...
  ],
})
```
In the above code snippet, <code>ConfigModule</code> is used to specify which env file we want to read and <code>ConfigService</code> to read and expose information inside the file to the application.


#### Deleting database in between tests:
To delete sqlite database in between tests, we will make use of a global <code>beforeEach</code> function that runs before each test is executed.

**Step 1: Configure jest option**
```TS
{
  // test/jest-e2e.json
  ...
  "setupFilesAfterEnv": ["<rootDir>/setup.ts"]
}
```

**Step 2: Write global <code>beforeEach</code> function to delete <code>test.sqlite</code> file**
```TS
// test/setup.ts

import {rm} from 'fs/promises';
import {join} from 'path';

global.beforeEach(async () => {
    try{
        await rm(join( __dirname, '..', 'test.sqlite'));
    }
    catch(error) {
        console.log("Error in deleting 'test.sqlite' file");
    }
});
```

#### 'SQLITE_BUSY: database is locked' error when running test
Jest runs all e2e tests simultaneously and all tests try to create a connection to SQLite test database which SQLite doesnot allow and hence, an error occurs. It can be fixed by appending <code>--maxWorkers=1</code> in <code>test:e2e</code> script in <code>package.json</code> file.
```TS
// package.json

{
  "scripts": {
    ...
    "test:e2e": "cross-env NODE_ENV=test jest --config ./test/jest-e2e.json --maxWorkers=1"
  }
}

```

## Section 15

### Association (Relations) in TypeORM

In TypeORM, relationships exist between tables in the database. When one of the tables has a foreign key that references the primary key of the other table, a relationship exists. This feature enhances the power and efficiency with which relational databases store information.

In general, relationships can be divided into four types.
1. One-to-one relationship
2. One-to-many relationship
3. Many-to-one relationship
4. Many-to-many relationship

In this project, we need to create a relationship between a user and a report. Since a user can have multiple reports, it falls into one-to-many relationship category.

![user - report relationship](notesResources/Section15_1.png)

![user - report relationship 2](notesResources/Section15_2.png)

![how it looks in database](notesResources/Section15_3.png)

### Steps to create association (relations) with Nest and TypeORM

![Steps to create relations with Nest and TypeORM](notesResources/Section15_4.png)

**Step 1: Identify type of association to create**

**Step 2: Add decorators to related entities**
```TS
// user.entity.ts
import { ... , OneToMany } from "typeorm";
import { Report } from "src/reports/report.entity";

@Entity()
export class User {
    ...

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];
}
```

```TS
// report.entity.ts
import { ManyToOne } from "typeorm";
import { User } from "src/users/user.entity";

@Entity()
export class Report {
    ...

    @ManyToOne(() => User, (user) => user.reports)
    user: User;
}
```

![user - report relationship with decorators](notesResources/Section15_5.png)

**Step 3: Associate user when a report is created**

 - Extract user info from the incoming request:
```TS
// reports.controller.ts
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

...
export class ReportsController {
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }
}
```
 - Assign the user to the report instance then save

```TS
// reports.service.ts
import { User } from 'src/users/user.entity';

export class ReportsService {
    
    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;

        return this.repo.save(report);
    }
}
```
**Step 4: Limit info shared in response**

The response received after creating a report with associated user now includes all user details including the password which we want to avoid. We will use a dto and serialize interceptor created earlier to solve this problem.
- Create a dto
```TS
// reports/dtos/report.dto.ts
import { Expose, Transform } from 'class-transformer'
import { User } from 'src/users/user.entity';

export class ReportDto {
    @Expose()
    id: number;

    @Expose()
    price: number;

    @Expose()
    year: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    mileage: number;

    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: number;
}
```

- Use <code>Serialize</code> interceptor and <code>ReportDto</code> in <code>ReportsController</code>
```TS
// reports.controller.dto
import { ReportDto } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

export class ReportsController {
    ...
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        ...
    }
}
```

## Section 16

### Add authorization
Add authorization to allow only administrators to approve a report.

![AdminGuard Diagram](notesResources/Section16_1.png)

**Steps to add authorization:**

Step 1: Add <code>admin</code> property in user entity.
```TS
// users/user.entity.ts
@Entity()
export class User {
    @Column({ default: true })
    admin: boolean;
    ...
}
```

Step 2: Create <code>AdminGuard</code> interceptor
```TS
// admin.guard.ts
import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.currentUser) {
            return false;
        }

        return request.currentUser.admin;
    }
}
```

Step 3: Use <code>AdminGuard</code> in <code>ReportsController</code>
```TS
//  reports.controller.ts
import { AdminGuard } from 'src/guards/admin.guard';

export class ReportsController {
    ...
    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved);
    }
}
```

Completing the above steps to add authorization will not work and will throw <code>403 - Forbidden resource</code> error. This is because <code>CurrentUser</code> interceptor which is responsible to get user details and assign it on request object executes after <code>AdminGuard</code> and as a result, <code>AdminGuard</code> doesnot find any user info in the request object and therefore a 403 error is thrown. To fix this, we will have to create a global middleware to extract user info from the request body.


### Order of execution of middlewares, guards and interceptors:

Order of execution is: **Middleware -> Guard > Interceptor**

![Order of execution of middlewares, guards and interceptors](notesResources/Section16_2.png)

![Solution to authorization problem](notesResources/Section16_3.png)

### Steps to create a global <code>CurrentUser</code> middleware

Step 1: Create <code>CurrentUserMiddleware</code>
```TS
// src/users/middlewares/current-user.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

declare global {
    namespace Express {
        interface Request {
            currentUser?: User
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(private usersService: UsersService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {};

        if (userId) {
            const user = await this.usersService.findOne(userId);

            req.currentUser = user;
        }

        next();
    }
}
```

Step 2: Use middleware in <code>UsersModule</code>
```TS
// src/users/users.module.ts
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  ...
  providers: [UsersService, AuthService]
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
```

### Common error in query params

All values received in 'query string' is received as string and therefore we may get validation errors if the dto has values marked as number. To solve this issue, we can transform values with <code>class-transformer</code> library.
```TS
// reports/dtos/get-estimate.dto.ts
import { Transform } from 'class-transformer';

export class GetEstimateDto {
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    lng: number;
}
```

## Section 17

### Get estimate of a vehicle<code></code>

Filter criteria for an estimate:

![Filter criteria of estimate](notesResources/Section17_1.png)

To get the estimate of a vehicle, we use <code>createQueryBuilder</code> method of reports repository to get the result.

```TS
// reports/reports.service.ts
async createEstimate({ make, model, year, lat, lng, mileage }: GetEstimateDto) {
    return this.repo.createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('make = :make', { make })
        .andWhere('model = :model', { model })
        .andWhere('lng = :lng', { lng })
        .andWhere('lat = :lat', { lat })
        .andWhere('year = :year', { year })
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .setParameters({ mileage })
        .limit(3)
        .getRawOne();
}
```

## Section 18

This section will focus mainly on making changes to make this project production ready.

![Changes to make in production code](notesResources/Section18_1.png)

### Set <code>cookieSession</code> key using environment variable. 
This key is used to encrypt cookies so it should not be set as a fixed string in the code (which will be pushed to Github, Gitlab etc).
```TS
// app.module.ts
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({
        keys: [this.configService.get('COOKIE_KEY')]
      })
    ).forRoutes('*');
  }
}
```

### Set <code>synchronize</code> option of TypeORM to 'false'
Synchronize makes the entity sync with the database every time the application is started. Hence, whenever a new column is added, deleted or a new table is added, TypeORM will automatically update the database once the server is started.

![synchronize option](notesResources/Section18_2.png)

```TS
// app.module.ts
  ...
  TypeOrmModule.forRootAsync({
    useFactory: (config: ConfigService) => {
      return {
        ...
        synchronize: false,
      }
    }
  }),
```

### Database migrations
With database migrations, we can define a set of controlled changes that aim to modify the structure of the data. They can include adding or removing tables, changing columns, or changing the data types, for example. While we could manually run SQL queries that make the necessary adjustments, this is not the optimal approach. Instead, we want our migrations to be easy to repeat across different application environments.

Migration is a file that contains two metohds - <code>up</code> and <code>down</code> The <code>up</code> method describes how to update the structure of the database while the <code>down</code> method describes how to undo the steps in <code>up</code> method. Multiple migration files can be run in a row.

![Migration file & methods](notesResources/Section18_3.png)

![Run migration files in row](notesResources/Section18_4.png)

### Move TypeORM configuration out of <code>AppModule</code>
Moving TypeORM configuraiton out of <code>AppModule</code> is required so that TypeORM CLI can make use of the config file to generate and run migrations.

- Step 1: Create <code>data-source.ts</code> file inside <code>src</code> folder
  ```TS
  // src/data-source.ts
  import { DataSource, DataSourceOptions } from 'typeorm';

  export const appDataSource = new DataSource({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ["**/*.entity.ts"],
      migrations: [__dirname + '/migrations/*.ts'],
  } as DataSourceOptions);
  ```

- Step 2: Create <code>typeorm.config.ts</code> file inside <code>src/config</code> folder
  ```TS
  // src/config/typeorm.config.ts
  import { Injectable } from "@nestjs/common";
  import { ConfigService } from "@nestjs/config";
  import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

  @Injectable()
  export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        if (process.env.NODE_ENV === 'test') {
            return {
                type: 'sqlite',
                synchronize: true,
                database: this.configService.get<string>('DB_NAME'),
                autoLoadEntities: true,
                migrationsRun: true,
            };
        }
        else if (process.env.NODE_ENV === 'development') {
            return {
                type: 'sqlite',
                synchronize: false,
                database: this.configService.get<string>('DB_NAME'),
                autoLoadEntities: true,
                migrationsRun: false,
            }
        }
        else if (process.env.NODE_ENV === 'production') {
            return {
                type: 'postgres',
                url: process.env.DATABASE_RL,
                migrationsRun: true,
                entities: ['**/*.entity.js'],
                ssl: {
                    rejectUnauthorized: false
                }
            }
        }
    }
  }
  ```
- Step 3: Use <code>TypeOrmConfigService</code> class created in step 2 inside <code>AppModule</code>
  ```TS
  // app.module.ts
  const cookieSession = require('cookie-session');
  import { TypeOrmConfigService } from './config/typeorm.config';

  @Module({
    imports: [
      TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService
      }),
    ],
  })
  ```

### Steps to create and run migrations
**Note:** Before following the steps below to create and run migrations, add a script in <code>package.json</code> file:
```JS
  "scripts": {
    ...
    "typeorm": "cross-env NODE_ENV=development typeorm-ts-node-commonjs"
  }
```

![Steps to create migration](notesResources/Section18_5.png)

- **Step 1: Stop development server**
- **Step 2: Create a migration file with TypeORM CLI. Use the command below:**
  ```bash
  npm run typeorm migration:create ./src/migrations/initial-schema
  ```
- **Step 3: Define changes in migration file.**<br>
  In the example below, we initialize the database by creating two tables required by <code>User</code> and <code>Report</code> entities
  ```TS
  import { MigrationInterface, QueryRunner, Table } from "typeorm"

  export class InitialSchema1694174959151 implements MigrationInterface {

      public async up(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.createTable(
              new Table({
                  name: 'user',
                  columns: [
                      {
                          name: 'id',
                          type: 'integer',
                          isPrimary: true,
                          isGenerated: true,
                          generationStrategy: 'increment',
                      },
                      {
                          name: 'email',
                          type: 'varchar',
                      },
                      {
                          name: 'password',
                          type: 'varchar',
                      },
                      {
                          name: 'admin',
                          type: 'boolean',
                          default: 'true',
                      },
                  ],
              }),
          );

          await queryRunner.createTable(
              new Table({
                  name: 'report',
                  columns: [
                      {
                          name: 'id',
                          type: 'integer',
                          isPrimary: true,
                          isGenerated: true,
                          generationStrategy: 'increment',
                      },
                      { name: 'approved', type: 'boolean', default: 'false' },
                      { name: 'price', type: 'float' },
                      { name: 'make', type: 'varchar' },
                      { name: 'model', type: 'varchar' },
                      { name: 'year', type: 'integer' },
                      { name: 'lng', type: 'float' },
                      { name: 'lat', type: 'float' },
                      { name: 'mileage', type: 'integer' },
                      { name: 'userId', type: 'integer' },
                  ],
              }),
          );
      }

      public async down(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(`DROP TABLE ""report""`);
          await queryRunner.query(`DROP TABLE ""user""`);
      }
  }
  ```

- **Step 4: Run migration file with the following command:**
  ```bash
  npm run typeorm migration:run -- -d ./src/data-source.ts
  ```
- **Step 5: Restart development server**

**Note:** Allow JS files to run during tests by adding an option in <code>tsconfig.json</code>
```bash
"allowJs": true
```

### References:
* https://stackoverflow.com/questions/3058/what-is-inversion-of-control
* https://betterprogramming.pub/implementing-a-generic-repository-pattern-using-nestjs-fb4db1b61cce
* https://docs.nestjs.com/fundamentals/custom-providers#di-fundamentals
* https://medium.com/@kaushiksamanta23/nest-js-tutorial-series-part-3-providers-services-dependency-injection-a093f647ce2e
* https://docs.nestjs.com/techniques/database
* https://docs.nestjs.com/exception-filters
* https://docs.nestjs.com/interceptors
* https://docs.nestjs.com/guards
* https://docs.nestjs.com/fundamentals/testing
* https://dev.to/marienoir/understanding-relationships-in-typeorm-4873
* https://medium.com/swlh/migrations-over-synchronize-in-typeorm-2c66bc008e74
* https://wanago.io/2022/07/25/api-nestjs-database-migrations-typeorm/