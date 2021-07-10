import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FriendsToChatDto } from '../dtos/friendsToChat.dto';
import { UserListMode } from '../_models/userListMode.enum';
import { ChatService } from '../_services/chat.service';
import {faLongArrowAltRight, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../_services/auth.service';
import { MessageToRoomDto, TYPE_OF_ACTION } from '../dtos/messageToRoom.dto';

@Component({
  selector: 'app-chat-with-user',
  templateUrl: './chat-with-user.component.html',
  styleUrls: ['./chat-with-user.component.scss']
})
export class ChatWithUserComponent implements OnInit {

  userListMode: UserListMode = 0;
  userList!: FriendsToChatDto[];
  displayList!: FriendsToChatDto[];
  messages: Array<string> = [];
  currentConnectedUserRoom: string = '';

  public icons: Array<IconDefinition> = [faLongArrowAltRight];

  constructor(private route: ActivatedRoute, private chatServ: ChatService,
    private authServ: AuthService) { }

  ngOnInit() {
    const modeFromStorage = localStorage.getItem('user-list-mode');
    if(modeFromStorage)
    {
      this.userListMode = parseInt(modeFromStorage);

    }else localStorage.setItem('user-list-mode', this.userListMode.toString());
    
    this.route.data.subscribe((res: any) => 
    {
      console.log(res);
      this.userList = res.users;
      if(this.userListMode === 0)
      {
        this.displayList = this.userList.filter((a: FriendsToChatDto) => { return a.isFriend});
      } else this.displayList = this.userList;
    });

    this.observeForJoin();
    this.observeMessages();
  }

  changeListStyle()
  {
    // default
    if(this.userListMode === 0)
    {
      this.userListMode = 1;
      this.displayList = this.userList;
    } else{
      this.userListMode = 0;
      this.displayList = this.userList.filter((a: FriendsToChatDto) => { return a.isFriend});
    }
    localStorage.setItem('user-list-mode', this.userListMode.toString());
  }

  connectWithUser(userId: string, keyId: string): void {
    this.disconnectWithAll(userId);

    let toSend: MessageToRoomDto = Object.assign({}, {
      roomId: keyId,
      nickname: this.authServ.userStored?.login,
      message: '',
      action: TYPE_OF_ACTION.JOIN,
      performAt: new Date()
    });

    this.chatServ.joinRoom(toSend);
  }

  disconnectWithAll(userId: string): void {
    this.chatServ.disconnectWithAll(userId);
  }

  observeForJoin() {
    this.chatServ.getConfirmationOfJoin()
    .subscribe((key: string) =>
    {
      console.log('Joined');
      this.currentConnectedUserRoom = key;
    });
  }

  observeMessages() {
    this.chatServ.getMessageFromRoom(this.currentConnectedUserRoom)
    .subscribe((res: any) => {
      console.log(res);
    })
  }
}
