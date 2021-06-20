import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FriendsToChatDto } from '../dtos/friendsToChat.dto';
import { UserListMode } from '../_models/userListMode.enum';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-chat-with-user',
  templateUrl: './chat-with-user.component.html',
  styleUrls: ['./chat-with-user.component.scss']
})
export class ChatWithUserComponent implements OnInit {

  userListMode: UserListMode = 0;
  userList!: FriendsToChatDto[];
  displayList!: FriendsToChatDto[];

  constructor(private route: ActivatedRoute, private chatServ: ChatService) { }

  ngOnInit() {
    const modeFromStorage = localStorage.getItem('user-list-mode');
    if(modeFromStorage)
    {
      this.userListMode = parseInt(modeFromStorage);

    }else localStorage.setItem('user-list-mode', this.userListMode.toString());
    
    this.route.data.subscribe((res: any) => 
    {
      this.userList = res.users;
      if(this.userListMode === 0)
      {
        this.displayList = this.userList.filter((a: FriendsToChatDto) => { return a.isFriend});
      } else this.displayList = this.userList;
    });

    // this.chatServ.getMessageFromRoom()
    // .subscribe((res: any) => {
    //   console.log(res);
    // })
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
}
