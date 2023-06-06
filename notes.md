### Setup validation in NestJS
<br>

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