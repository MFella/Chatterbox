import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment as env} from '../../environments/environment';
import { MessageToReturnDto } from '../dtos/messageToReturn.dto';
import { TYPE_OF_ACTION } from '../dtos/messageToRoom.dto';
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

  getPrivateRoomMessages(roomId: string): Observable<any[]> 
  {
    return this.http.get<any[]>(env.backUrl + `message/chat-all?roomId=${roomId}`)
      .pipe(
        map((res: any[]) => {
          const renamedMessages: any[] = [];
          res.forEach((el: any) => {
            const {content, senderLogin, ...rest} = el;
            let messageToReturn = {message: content, action: TYPE_OF_ACTION.MESSAGE, nickname: senderLogin, ...rest};
            renamedMessages.push(messageToReturn);
          });
          return renamedMessages;
        })
      )
  }
}
