import { ChangeDetectorRef, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FriendsToChatDto } from '../dtos/friendsToChat.dto';
import { UserListMode } from '../_models/userListMode.enum';
import { ChatService } from '../_services/chat.service';
import {faLongArrowAltRight, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../_services/auth.service';
import { MessageToRoomDto, TYPE_OF_ACTION } from '../dtos/messageToRoom.dto';
import { MessagesService } from '../_services/messages.service';

@Component({
  selector: 'app-chat-with-user',
  templateUrl: './chat-with-user.component.html',
  styleUrls: ['./chat-with-user.component.scss']
})
export class ChatWithUserComponent implements OnInit {

  @ViewChild('msgContainer') private msgContainer!: ElementRef;

  userListMode: UserListMode = 0;
  userList!: FriendsToChatDto[];
  displayList!: FriendsToChatDto[];
  messages: Array<any> = [];
  selectedUserId: any;
  currentConnectedUserRoom: string = '';
  messageFromInput: string = '';

  @ViewChild('msgInput')
  msgInput!: ElementRef;

  public icons: Array<IconDefinition> = [faLongArrowAltRight];

  constructor(private route: ActivatedRoute, private chatServ: ChatService,
    private authServ: AuthService, private changeDetectorRef: ChangeDetectorRef,
    private msgServ: MessagesService) { }

  ngOnInit() {
    const modeFromStorage = localStorage.getItem('user-list-mode');
    if(modeFromStorage)
    {
      this.userListMode = parseInt(modeFromStorage);

    }else localStorage.setItem('user-list-mode', this.userListMode.toString());
    
    this.route.data.subscribe((res: any) => 
    {
      console.log(res);
      this.userList = res.users.filter((a: FriendsToChatDto) => a._id !== this.authServ.userStored?._id);
      if(this.userListMode === 0)
      {
        this.displayList = this.userList.filter((a: FriendsToChatDto) => { return a.isFriend});
      } else this.displayList = this.userList;
    });

    this.observeForJoin();
    this.chatServ.retrieveMsgEve.subscribe((res: any) => {
      if(res) {
        console.log('observing ', res);
        this.observeMessages();
        this.loadMessages(res.roomId);
      }
    })
  }

  changeListStyle()
  {
    // default
    if(this.userListMode === 0)
    {
      this.userListMode = 1;
      this.displayList = this.userList.filter((a: FriendsToChatDto) => a._id !== this.authServ.userStored?._id);
    } else{
      this.userListMode = 0;
      this.displayList = this.userList.filter((a: FriendsToChatDto) => { return a.isFriend});
    }
    this.selectedUserId = null;
    localStorage.setItem('user-list-mode', this.userListMode.toString());
  }

  connectWithUser(userId: string, keyId: string): void {
    this.selectedUserId = userId;
    this.disconnectWithAll(userId);
    
    this.chatServ.overrideSocketWithAuth(localStorage.getItem('id_token') ?? '');

    let toSend: MessageToRoomDto = Object.assign({}, {
      roomId: keyId,
      nickname: this.authServ.userStored?.login,
      message: '',
      action: TYPE_OF_ACTION.JOIN,
      performAt: new Date()
    });

    this.currentConnectedUserRoom = keyId;
    this.chatServ.joinPrivateRoom(toSend);
  }

  disconnectWithAll(userId: string): void {
    this.chatServ.disconnectWithAll(userId);
  }

  observeForJoin() {
    this.chatServ.getConfirmationOfJoin()
    .subscribe((key: string) =>
    {
      this.chatServ.retrieveMsgEve.next(key);
      this.currentConnectedUserRoom = key;
    });
  }

  observeMessages() {
    this.chatServ.getMessageFromRoom(this.currentConnectedUserRoom)
    .subscribe((res: any) => {
      this.messages.push(res);
      this.changeDetectorRef.detectChanges();
      this.scrollToBottom();
    })
  }
  
  loadMessages(roomId: string) {
    this.msgServ.getPrivateRoomMessages(roomId)
      .subscribe((res: any[]) => {
        console.log(res);
        this.messages.push(...res)
      })
  }

  sendMessage() {

    if(!this.messageFromInput) {
      return;
    }

    const msg: MessageToRoomDto = {
      roomId: this.currentConnectedUserRoom,
      nickname: this.authServ.userStored?.login,
      message: this.messageFromInput,
      action: TYPE_OF_ACTION.MESSAGE,
      performAt: new Date()
    };

    this.chatServ.sendMessageToUserRoom(msg);
    this.msgInput.nativeElement.value = '';
    this.msgInput.nativeElement.focus();
    this.messageFromInput = '';

  }

  scrollToBottom(): void
  {
    try{
      const listOfMsgs = document.querySelectorAll('.perform_content');

      this.msgContainer.nativeElement.scrollTop = this.msgContainer.nativeElement.scrollHeight + listOfMsgs[listOfMsgs.length-1].scrollHeight;
    }catch(err: unknown)
    {
      console.log(err);
    }
  }

  fetchMessages(roomId: string): void {
    this.chatServ.fetchMessages(roomId)
      .subscribe((res: any) => {
        console.log(res);
      })
  }
}
