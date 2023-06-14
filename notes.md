## Services and Repositories
<br/>

### Difference between services and repositories:
<br/>

|Services|Repositories|
|--------|------------|
| Its a class | Its a class |
| #1 place to put any business logic| #1 place to put storage related logic |
| Uses one or more repositories to find or store data | Usually ends up being a TypeORM entity, a Mongoose Schema, or similar |

### Inversion of Control Principle
Classes should not create instances of its dependencies on its own.