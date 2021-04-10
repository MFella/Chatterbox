import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService{

  private socket!: any;

  constructor() {
    this.socket = io(environment.socketBackUrl )
  }

  selectedRoom: BehaviorSubject<string> = new BehaviorSubject("");


  public sendMessage(msg: string)
  {
    this.socket.emit('msgToServer', msg);
  }

  public getMessages = () => 
  {
    return Observable.create((observer: any) =>
    {
      this.socket.on('msgToClient', (msg: string) =>
      {
        observer.next(msg);
      })
    })
  }
}
