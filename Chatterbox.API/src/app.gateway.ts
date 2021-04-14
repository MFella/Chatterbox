import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3101)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

    @WebSocketServer() server: Server;
    
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
        console.log('Message should be sent');
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string)
    {
        client.join(room);
        this.logger.log("NICE");
        client.emit('joinedRoom', room);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, room: string)
    {
        client.leave(room);
        client.emit('leftRoom', room);
    }

}