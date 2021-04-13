import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RoomDto } from '../dtos/room.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService{

  private socket!: any;

  constructor(private http: HttpClient) {
    this.socket = io(environment.socketBackUrl )
  }

  selectedRoom: BehaviorSubject<RoomDto> = new BehaviorSubject({_id: "", name: "", limit: 0});


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

  public joinRoom(room: string)
  {
    this.socket.emit('join', room);
  }

  public leftRoom(room: string)
  {
    this.socket.emit('left', room);
  }

  public getConfirmationOfJoin = () =>
  {
    return Observable.create((obs: any) =>
    {
      this.socket.on('afterJoin', (msg: string) =>
      {
        obs.next(msg);
      })
    })
  }

  public getRoomList(): Observable<RoomDto[]>
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.get<RoomDto[]>(environment.backUrl + 'channel/list', {headers});
  }
}
