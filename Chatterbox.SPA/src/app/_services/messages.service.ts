import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment as env} from '../../environments/environment';
import { MessageToSendDto } from '../dtos/messageToSend.dto';
import { UserListRecordDto } from '../dtos/userListRecord.dto';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient) { }


  getUserList(): Observable<UserListRecordDto[]>
  {
    return this.http.get<UserListRecordDto[]>(env.backUrl + `message/all-users`);
  }

  sendMessage(messageToSendDto: MessageToSendDto)
  {
    return this.http.post(env.backUrl + 'message', messageToSendDto);
  }
}
