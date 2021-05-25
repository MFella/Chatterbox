import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { RoomDto } from '../dtos/room.dto';
import { RoleTypes } from '../_models/userStored.interface';
import { AuthService } from '../_services/auth.service';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

  //roomNames: Array<string> = ["CH1", "CH2", "CH3", "CH4", "CH5"];
  rooms!: RoomDto[];

  constructor(public chatServ: ChatService, private route: ActivatedRoute,
    public authServ: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe((res: Data) =>
    { 
      this.rooms = res.rooms;
    })
  }

  selectRoom(chatRoom: RoomDto)
  {
    this.chatServ.selectedRoom.next(chatRoom);
    this.trackActivity();
  }

  private trackActivity()
  {
    const nickToTrack = this.authServ.userStored ? this.authServ.userStored.login: localStorage.getItem('volatileNick');
    const roleToTrack = this.authServ.userStored ? RoleTypes.REGISTERED_USER : RoleTypes.GUEST_USER;

    if(!nickToTrack)
    {
     this.authServ.currNick = this.authServ.generateNick(nickToTrack);
    }
    
    this.authServ.trackActivity(this.authServ.currNickname, roleToTrack)
    .subscribe((res: any) =>
    {
      console.log(res);

    }, (err: any) =>
    {
      console.log(err);
    })
  }
}
