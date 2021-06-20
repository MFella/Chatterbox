import { Logger, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { RolesGuard } from "./auth/roles/roles.guard";
import { MessageToRoomDto } from "./channel/dto/messageToRoom.dto";

@WebSocketGateway(3101)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

    @WebSocketServer() server: any;
    
    // connectedClients: Socket[] = [];

    private logger: Logger = new Logger('AppGateway');
    public storedAllUsers: Object[] = [];

    @SubscribeMessage('msgToServer')
    async handleMessage(@MessageBody() data: string): Promise<void>
    {
        console.log(data);
        this.server.emit('msgToClient', data);
    }

    @SubscribeMessage('join')
    async joinToRoom(@ConnectedSocket()client: Socket, @MessageBody() room: string): Promise<void>
    {
        client.join(room);
        this.server.emit('afterJoin', room);
    }

    @SubscribeMessage('left')
    async leftRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string): Promise<void>
    {
        client.leave(room);
        this.server.emit('afterLeft', room);
    }

    @SubscribeMessage("messageToRoom")
    async messageToRoom(@ConnectedSocket() client: Socket, @MessageBody() messageToRoomDto: MessageToRoomDto): Promise<void>
    {

        if(Object.values(client.rooms).includes(messageToRoomDto.roomId))
        {
            // console.log(this.server.eio.clientsCount);
            // total - wszyscy połączeni
            this.server.to(messageToRoomDto.roomId).emit('getMessage', messageToRoomDto);
        }
    }

    @SubscribeMessage('joinToUserRoom')
    @UseGuards(JwtAuthGuard)
    async joinToUserRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string): Promise<void>
    {
        client.join(roomId);
    }

    @SubscribeMessage('leaveFromUserRoom')
    @UseGuards(JwtAuthGuard)
    async leaveFromUserRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string): Promise<void>
    {
        client.leave(roomId);
    }

    @SubscribeMessage('msgToUserRoom')
    @UseGuards(RolesGuard)
    async messageToUserRoom(@ConnectedSocket() client: Socket, @MessageBody() messageToUserRoomDto: MessageToRoomDto): Promise<void>
    {
        this.server.to(messageToUserRoomDto.roomId).emit('getMessage', messageToUserRoomDto);
    }

    afterInit(server: Server)
    {
        this.logger.log('Init');
        server.emit('afterConnection', "CO TAM DOKTORKU");
    }

    handleDisconnect(client: Socket)
    {
        this.logger.log(`Client disconnected: ${client?.id}`);
    }

    async handleConnection(client: Socket, ...args: any[])
    {
        this.logger.log(`Client connected: ${client.id}`);
        this.server.emit('afterConnection', 'Something after handle connection');
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() messageToRoomDto: MessageToRoomDto)
    {
        client.join(messageToRoomDto.roomId);

        console.log(messageToRoomDto);
        this.storedAllUsers.push({roomId: messageToRoomDto.roomId, nickname: messageToRoomDto.nickname});
        this.server.to(messageToRoomDto.roomId).emit('jointRoom', messageToRoomDto);
        this.logger.log("NICE");
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() messageToRoomDto: MessageToRoomDto)
    {
        this.server.to(messageToRoomDto.roomId).emit('leftRoom', messageToRoomDto);
        this.storedAllUsers = this.storedAllUsers.filter((el: any) => {
            return el.roomId !== messageToRoomDto.roomId && el.nickname !== messageToRoomDto.nickname
        });
        client.leave(messageToRoomDto.roomId);
    }


}