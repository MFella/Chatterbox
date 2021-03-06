import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { MessageToCreateDto } from "./dtos/messageToCreate.dto";
import { PerformInvitationMessageDto } from "./dtos/performInvitationMessage.dto";
import { RoomIdDto } from "./dtos/roomId.dto";
import { MessageService } from "./message.service";


@Controller('message')
export class MessageController {

    constructor(
        private readonly messageServ: MessageService
    )
    {}

    @Get('all-users')
    @UseGuards(JwtAuthGuard)
    async getAllUsers(@Req() req)
    {
        return await this.messageServ.getAllUsers(req.user._id.toString());
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    async sendMessage(@Req() req, @Body() messageToCreateDto: MessageToCreateDto)
    {
        console.log(messageToCreateDto);
        return await this.messageServ.createMessage(messageToCreateDto, req.user._id.toString());
    } 

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async getMyMessages(@Req() req)
    {
        return await this.messageServ.getMessages(req.user._id.toString());
    }

    @Put('perform-inv')
    @UseGuards(JwtAuthGuard)
    async performInvitation(@Req() req, @Body() performInvitationMessageDto: PerformInvitationMessageDto)
    {
        return await this.messageServ.performInvitation(req.user._id.toString(), performInvitationMessageDto);
    }

    @Get('chat-all')
    @UseGuards(JwtAuthGuard)
    async getMyChatMessages(@Req() req, @Query() roomIdDto: RoomIdDto) {
        return await this.messageServ.getChatMessages(req.user._id.toString(), roomIdDto.roomId);
    }
}