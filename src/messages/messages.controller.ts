import { Controller, Get, Post } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
    @get()
    listMessages() {

    }

    @Post()
    createMessage() {

    }

    @Get('/:id')
    getMessage() {

    }
}
