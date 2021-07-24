import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomKey } from "src/auth/entities/room-key.entity";
import { User } from "src/users/user.entity";
import { ChatMessage } from "./chat-message.entity";
import { MessageController } from "./message.controller";
import { Message } from "./message.entity";
import { MessageService } from "./message.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, User, ChatMessage, RoomKey])
    ],
    providers: [MessageService],
    exports: [MessageService],
    controllers: [MessageController]
})
export class MessageModule{} 