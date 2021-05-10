import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
import { MessageToRoomDto } from "./channel/dto/messageToRoom.dto";

@WebSocketGateway(3101)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

    @WebSocketServer() server: Server;
    
    // connectedClients: Socket[] = [];

    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('msgToServer')
    async handleMessage(@MessageBody() data: string): Promise<void>
    {
        //console.log(data);
        //this.server.emit('msgToClient', data);
        console.log(data);
        this.server.emit('msgToClient', data);
    }

    @SubscribeMessage('join')
    async joinToRoom(@ConnectedSocket()client: Socket, @MessageBody() room: string): Promise<void>
    {
        //console.log(client);
        client.join(room);
        this.logger.log(`Client joint to room ${room}`)
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
            //console.log(`Try to emit: ${messageToRoomDto.message}`);
            //let {roomId, ...rest} = messageToRoomDto;
            this.server.to(messageToRoomDto.roomId).emit('getMessage', messageToRoomDto);
        }

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
        console.log()
        console.log(messageToRoomDto);
        client.join(messageToRoomDto.roomId);
        console.log(this.server)
        this.server.to(messageToRoomDto.roomId).emit('jointRoom', messageToRoomDto);
        this.logger.log("NICE");
        //client.emit('joinedRoom', room);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() messageToRoomDto: MessageToRoomDto)
    {
        this.server.to(messageToRoomDto.roomId).emit('leftRoom', messageToRoomDto);
        //client.emit('leftRoom', messageToRoomDto.roomId);
        client.leave(messageToRoomDto.roomId);
    }

}