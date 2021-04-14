import { Component, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faHandshake, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { RoomDto } from '../dtos/room.dto';
import { AuthService } from '../_services/auth.service';
import { ChatService } from '../_services/chat.service';
import { SweetyService } from '../_services/sweety.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  public currentRoom!: string | null;
  public pickedRoom!: RoomDto | null;

  public icons: Array<IconDefinition> = [faEnvelope, faSignOutAlt, faHandshake];

  constructor(public chatServ: ChatService, private authServ: AuthService,
    private sweety: SweetyService) { }

  ngOnInit() {

    this.chatServ.selectedRoom.subscribe((res: RoomDto) =>
    {
      this.pickedRoom = res;
      // leave the current room!
      this.currentRoom = null;

      this.chatServ.sendMessage("Are you serious?");
      this.chatServ.getMessages()
      .subscribe((message: string) =>
      {
        console.log(message);
      })

    });
  }

  public async joinRoom()
  {

    if(this.authServ.userStored === null)
    {
      const result = await this.sweety.submitNickname();
      console.log(result);

    }else{

      this.chatServ.joinRoom(this.pickedRoom!._id);
      this.chatServ.getConfirmationOfJoin()
      .subscribe((room: string) =>
      {
        console.log(`Connected to room: ${room}`);
        this.currentRoom = room;
      })
    }
  }

}
