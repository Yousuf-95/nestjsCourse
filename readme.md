# Services and Repositories
<br/>

**Repositories:** Repositories are classes or components that encapsulate the logic required to access data sources. They centralize common data access functionality, providing better maintainability and decoupling the infrastructure or technology used to access databases from the domain model layer.

**Services:** Services is a class that uses one or more repositories to find or store data. 
<hr></hr>

## Difference between services and repositories:
<br/>

![Difference between Services and Repositories](notesResources/Section5_1.png)

## Service and repository class mapping (in general):
![Service and Repository class](notesResources/Section5_2.png)

<hr></hr>

## Inversion of Control principle and Dependency Injection (DI) Pattern:
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

Setting up database connection in App module:

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

Steps to create an entity:

![Steps to create an entity](notesResources/Section8_3.png)

Step 1: Create an entity file:
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

Step 2: Update the module the entity belongs to:
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

Step 3: Update App module:
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

### References:
* https://stackoverflow.com/questions/3058/what-is-inversion-of-control
* https://betterprogramming.pub/implementing-a-generic-repository-pattern-using-nestjs-fb4db1b61cce
* https://docs.nestjs.com/fundamentals/custom-providers#di-fundamentals
* https://medium.com/@kaushiksamanta23/nest-js-tutorial-series-part-3-providers-services-dependency-injection-a093f647ce2e
* https://docs.nestjs.com/techniques/database