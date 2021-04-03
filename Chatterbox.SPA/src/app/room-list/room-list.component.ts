import { Component, OnInit } from '@angular/core';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

  roomNames: Array<string> = ["CH1", "CH2", "CH3", "CH4", "CH5"];

  constructor(public chatServ: ChatService) { }

  ngOnInit() {
  }

  selectRoom(value: string)
  {
    this.chatServ.selectedRoom.next(value);
  }

}
