import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCheckCircle, faEnvelope, faPlusCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { MessageToSendDto, TypeOfMessage } from '../dtos/messageToSend.dto';
import { IsFriend, Profile } from '../_models/profile.interface';
import { AuthService } from '../_services/auth.service';
import { MessagesService } from '../_services/messages.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profile!: Profile;
  public icons: Array<IconDefinition> = [faPlusCircle, faEnvelope, faCheckCircle];

  constructor(private route: ActivatedRoute, public authServ: AuthService, private msgServ: MessagesService) { }

  ngOnInit() {
    this.route.data.subscribe((res: any) =>
    {
      console.log(res);
      this.profile = res.profile;
    })
  }

  makeFriend()
  {
    const messageToSendDto: MessageToSendDto = 
    {
      receiverId: this.profile._id,
      typeOfMessage: TypeOfMessage.INVITATION,
      title: 'Invitation',
      content: 'Hello buddy, I want to be your friend. Cheers!'
    }

    this.msgServ.sendMessage(messageToSendDto)
    .subscribe((res: any) =>
    {
      console.log(res);
      if(res)
      {
        this.profile.isFriends = IsFriend.INV_PEND;
      }

    }, (err: any) =>
    {

    })

  }

}
