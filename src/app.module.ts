import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { NestFactory } from '@nestjs/core';

@Module({
    controllers: [AppController]
})
export class AppModule {}