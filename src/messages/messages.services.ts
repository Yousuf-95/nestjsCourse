import { MessagesRepository } from "./messages.repository";

export class MessagesService {
    messagesRepo: MessagesRepository;

    constructor() {
        // Service is creating its own depenencies
        // DONT DO THIS ON REAL APPS. Use dependency injection instead.
        this.messagesRepo = new MessagesRepository();
    }

    findOne(id: string) {
        return this.messagesRepo.findOne(id);
    }

    findAll() {
        return this.messagesRepo.findAll();
    }

    create(content) {
        return this.messagesRepo.create(content);
    }
}