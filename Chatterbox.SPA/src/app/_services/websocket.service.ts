import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import * as Rx from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: any;

  constructor() { }

  // connect(): Rx.Subject<any>{
  //   this.socket = io(environment.socketBackUrl);

  //   let observable = new Observable(obs =>
  //     {
  //       this.socket.on('message', (data: string) =>
  //       {
  //         console.log("Received some data");
  //         obs.next(data);
  //       })

  //       return () =>
  //       {
  //         this.socket.disconnect();
  //       }
  //     });

  //     let observer = {
  //       next: (data: any) =>
  //       {
  //         this.socket.emit('message', JSON.stringify(data));
  //       },
  //     }

  //     return new AnonymousSubject<MessageEvent<string>>(observer, observable);
  // }

}
