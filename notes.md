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

1. Controllers: Handles incoming requests.
2. Services: Handles data access and business logic.
3. Modules: Groups together code.
4. Pipes: Validates incoming data.
5. Filters: Handles errors that occurs during error handling.
6. Guards: Handles authentication.
7. Interceptors: Adds extra logic to incoming requests or outgoing responses.
8. Repositories: Handles data stored in a DB.