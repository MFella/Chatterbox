import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { MessageToCreateDto } from "./dtos/messageToCreate.dto";
import { MessageService } from "./message.service";


@Controller('message')
export class MessageController {

    constructor(
        private readonly messageServ: MessageService
    )
    {}

    @Get('all-users')
    async getAllUsers()
    {
        return await this.messageServ.getAllUsers();
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    async sendMessage(@Req() req, @Body() messageToCreateDto: MessageToCreateDto)
    {
        console.log(messageToCreateDto);
        // return await this.messageServ.createMessage(messageToCreateDto);
    } 
}