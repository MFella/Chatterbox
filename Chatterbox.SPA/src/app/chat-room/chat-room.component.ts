import { Component, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faHandshake, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  public currentRoom!: string;
  public icons: Array<IconDefinition> = [faEnvelope, faSignOutAlt, faHandshake];

  constructor(public chatServ: ChatService) { }

  ngOnInit() {
    this.chatServ.selectedRoom.subscribe((res: string) =>
    {
      this.currentRoom = res;

      console.log("wow")
      this.chatServ.sendMessage("Are you serious?");
      this.chatServ.getMessages()
      .subscribe((message: string) =>
      {
        console.log(message);
      })

    });


  }

}
