import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { MessageController } from "./message.controller";
import { Message } from "./message.entity";
import { MessageService } from "./message.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, User])
    ],
    providers: [MessageService],
    exports: [MessageService],
    controllers: [MessageController]
})
export class MessageModule{} 