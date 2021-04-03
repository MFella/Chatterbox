import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(public socket: Socket) { }

  selectedRoom: BehaviorSubject<string> = new BehaviorSubject("");

  sendMessage(msg: string)
  {
    console.log(`Msg send: ${msg}`);
    this.socket.emit('msgToServer', msg);
  }

  getMessages()
  {
    console.log("Message should be received")
    return this.socket.fromEvent('afterConnection').pipe(map((data: any) => data.msg))
  }

  joinRoom(room: string)
  {
    this.socket.emit('joinRoom', room);
  }
  
}
