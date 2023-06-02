import { Controller, Get } from "@nestjs/common";

// Any route applied to 'Controller' decorator will apply to 
// all the routes defined in the controller.
// Routes in this controller are: 'nest/' and 'nest/bye'

@Controller('nest')
export class AppController {
    @Get('/')
    getRootRoute() {
        return 'Hello from NestJS';
    }

    @Get('/bye')
    getByeRoute() {
        return 'Bye';
    }
}