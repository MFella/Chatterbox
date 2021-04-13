import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { RoomDto } from '../dtos/room.dto';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

  //roomNames: Array<string> = ["CH1", "CH2", "CH3", "CH4", "CH5"];
  rooms!: RoomDto[];

  constructor(public chatServ: ChatService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((res: Data) =>
    { 
      this.rooms = res.rooms;
    })
  }

  selectRoom(chatRoom: RoomDto)
  {
    this.chatServ.selectedRoom.next(chatRoom);
  }

}
