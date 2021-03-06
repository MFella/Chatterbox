import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faHandshake, faSignOutAlt, faCogs } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { ChangeNickDto } from '../dtos/changeNick.dto';
import { MessageToRoomDto, TYPE_OF_ACTION } from '../dtos/messageToRoom.dto';
import { RoomDto } from '../dtos/room.dto';
import { RoleTypes } from '../_models/userStored.interface';
import { AlertService } from '../_services/alert.service';
import { AuthService } from '../_services/auth.service';
import { ChatService } from '../_services/chat.service';
import { SweetyService } from '../_services/sweety.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  @ViewChild('msgContainer') private msgContainer!: ElementRef;

  public currentRoom!: string | null;
  public pickedRoom!: RoomDto | null;
  public messageInput!: string | undefined;
  public messages: MessageToRoomDto[] = [];

  public icons: Array<IconDefinition> = [faEnvelope, faSignOutAlt, faHandshake, faCogs];

  constructor(public chatServ: ChatService, public authServ: AuthService,
    private sweety: SweetyService, private alert: AlertService) { }

  ngOnInit() {

    console.log(this.authServ.userStored);

    this.chatServ.selectedRoom.subscribe((res: RoomDto) =>
    {
      this.pickedRoom = res;
      // leave the current room!
      if(this.currentRoom)
      {
        this.leftRoom();
      }
      this.chatServ.sendMessage("Are you serious?");
    });

    this.chatServ.getMessageFromRoom(this.currentRoom ?? '')
    .subscribe((res: MessageToRoomDto) =>
    {
      console.log(res);
      this.scrollToBottom();
      this.messages.push(res);
    });
    this.chatServ.getConfirmationOfLeft()
    .subscribe((res: MessageToRoomDto) =>
    {
      this.messages = [];
      this.messages.push(res);
      this.scrollToBottom();
      this.currentRoom = null;
    });

    this.chatServ.getConfirmationOfJoin()
    .subscribe((res: MessageToRoomDto) =>
    {
      this.messages.push(res);
      this.currentRoom = res.roomId;
    })
  }

  public sendMessageToRoom(msg: string | undefined)
  {
    let toSend: MessageToRoomDto = Object.assign({}, {
      roomId: this.currentRoom ?? '',
      message: msg ?? '',
      nickname: this.authServ.userStored?.login ?? localStorage.getItem('volatileNick') ?? '',
      action: TYPE_OF_ACTION.MESSAGE,
      performAt: new Date()
    });
    
    this.chatServ.sendMessageToRoom(toSend);
    this.messageInput = '';
  }


  public async joinRoom()
  {

    if(this.authServ.userStored === null && localStorage.getItem('volatileNick') === null)
    {
      const result = await this.sweety.submitNickname();
      console.log(result);

      if(!/^[a-zA-Z0-9_.-]*$/.test(result))
      {
        this.alert.error('Bad pattern of nick - try again');
      } else
      {
        this.authServ.checkNickname(result)
        .subscribe((res: any) =>
        {
            if(res)
            {
              this.alert.success(`You has been logged in`);
              localStorage.setItem('volatileNick', result);

              let toSend: MessageToRoomDto = Object.assign({}, {
                roomId: this.pickedRoom!._id,
                nickname: result,
                message: '',
                action: TYPE_OF_ACTION.JOIN,
                performAt: new Date()
              })

              this.chatServ.joinRoom(toSend);
  
            }else
            {
              this.alert.error(`Login: ${result} is not available - try again`);
            }
  
        }, (err: any) =>
        {
          console.log(err);
          this.alert.error(`Error occured: ${err.error.message[0]}`);
        })
      }

    }else{


      if(this.authServ.userStored !== null)
      {
        let toSend: MessageToRoomDto = Object.assign({}, {
          roomId: this.pickedRoom?._id ?? '',
          nickname: this.authServ.userStored?.login ?? '',
          message: '',
          action: TYPE_OF_ACTION.JOIN,
          performAt: new Date()
        })
        this.chatServ.joinRoom(toSend);
      }
      else
      {
        let toSend: MessageToRoomDto = Object.assign({}, {
          roomId: this.pickedRoom?._id ?? '',
          nickname: localStorage.getItem('volatileNick') ?? '',
          message: '',
          action: TYPE_OF_ACTION.JOIN,
          performAt: new Date()
        })
        this.chatServ.joinRoom(toSend);
      }
    }
  }




  leftRoom()
  {
    if(localStorage.getItem('volatileNick') === null && this.authServ.userStored === null)
    {
      this.alert.error('You are not allowed to do this!');
      return;
    }else
    {

      if(this.authServ.userStored !== null)
      {
        let toSend: MessageToRoomDto = Object.assign({}, {
          roomId: this.currentRoom ?? '',
          nickname: this.authServ.userStored.login,
          message: '',
          action: TYPE_OF_ACTION.LEAVE,
          performAt: new Date()
        })

        this.chatServ.leftRoom(toSend);

      } else
      {

        let toSend: MessageToRoomDto = Object.assign({}, {
          roomId: this.currentRoom ?? '',
          nickname: localStorage.getItem('volatileNick') ?? '',
          message: '',
          action: TYPE_OF_ACTION.LEAVE,
          performAt: new Date()
        })

        this.chatServ.leftRoom(toSend);

      }

    
    }
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

  public async changeNickname(): Promise<void>
  {
    const result = await this.sweety.changeVolatileNickname(this.authServ.currNickname ?? '');
    console.log(result);

    if(result.length === 0) return;

    if(!/^[a-zA-Z0-9_.-]*$/.test(result) || result.length < 5)
    {
      this.alert.error('Nickname has inappropriate pattern');
    }else{

      const changeNickDto: ChangeNickDto = {
        login: this.authServ.currNickname ?? '',
        newLogin: result,
        roleType: this.authServ.userStored? RoleTypes.REGISTERED_USER : RoleTypes.GUEST_USER
      }
      this.authServ.changeVolatileNickname(changeNickDto)
      .subscribe((res: boolean) => 
      {
        if(res)
        {
          localStorage.clear();
          localStorage.setItem('volatileNick', result);
          this.authServ.currNick = result;
          this.alert.success('Nickname has been changed!');
        }else{

          this.alert.error('This nick is already taken. Try another one.');

        }
      }, (err: any) =>
      {
        console.log(err);
        this.alert.error('Nickname is not appropriate')
      });

    }
  }

}
