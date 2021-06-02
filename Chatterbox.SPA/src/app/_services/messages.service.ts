import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment as env} from '../../environments/environment';
import { MessageToReturnDto } from '../dtos/messageToReturn.dto';
import { MessageToSendDto } from '../dtos/messageToSend.dto';
import { PerformInvitationMessageDto } from '../dtos/performInvitationMessage.dto';
import { UserListRecordDto } from '../dtos/userListRecord.dto';
import { PerformInvitationAction } from '../inbox/inbox.component';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient) { }


  getUserList(): Observable<UserListRecordDto[]>
  {
    return this.http.get<UserListRecordDto[]>(env.backUrl + `message/all-users`);
  }

  sendMessage(messageToSendDto: MessageToSendDto): Observable<boolean>
  {
    return this.http.post<boolean>(env.backUrl + 'message', messageToSendDto);
  }

  getMessages(): Observable<MessageToReturnDto[]>
  {
    return this.http.get<MessageToReturnDto[]>(env.backUrl + 'message/all');
  }

  performInvitationAction(action: PerformInvitationAction, messageId: string): Observable<boolean>
  {
    const messageToPerform: PerformInvitationMessageDto = {action, messageId};


    return this.http.put<boolean>(env.backUrl + 'message/perform-inv', messageToPerform);
  }
}
