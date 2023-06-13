import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.services';

@Controller('messages')
export class MessagesController {

    messagesService: MessagesService;

    constructor() {
        // DONT DO THIS IN REAL APP. Use dependency injection instead.
        this.messagesService = new MessagesService();
    }

    @Get()
    listMessages() {
        return this.messagesService.findAll();
    }

    @Post()
    createMessage(@Body() body: CreateMessageDto) {
        return this.messagesService.create(body.content);
    }

    @Get('/:id')
    async getMessage(@Param('id') id: string) {
        const message =  await this.messagesService.findOne(id);

        if(!message) {
            throw new NotFoundException('Message not found.');
        }

        return message;
    }
}
