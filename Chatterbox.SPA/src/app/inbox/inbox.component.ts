import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCheck, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { MessageToReturnDto } from '../dtos/messageToReturn.dto';
import { AlertService } from '../_services/alert.service';
import { MessagesService } from '../_services/messages.service';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  messages: MessageToReturnDto[] = [];
  currentMessage!: MessageToReturnDto | undefined;

  constructor(private route: ActivatedRoute, private msgServ: MessagesService, private alert: AlertService) { }

  public icons: Array<IconDefinition> = [faCheck, faTimes];
  
  ngOnInit() {

    this.route.data.subscribe((res: any) => 
    {
      this.messages = res.messages;
      console.log(res)
    })
  }

  showMessage(id: string)
  {
    this.currentMessage = this.messages.find((el: MessageToReturnDto) => el._id === id);
  }

  performInvitationAction(action: string, msgId: string | undefined)
  {
    
    this.msgServ.performInvitationAction(action as PerformInvitationAction, msgId ?? '')
    .subscribe((res: boolean) =>
    {
      console.log(res);

      this.currentMessage =  undefined;
      this.messages = this.messages.filter((el: MessageToReturnDto) => el._id !== msgId)

      if(action === PerformInvitationAction.ACCEPT)
      {
        this.alert.success('You\'ve got new friend!');
      }

      if(action === PerformInvitationAction.DECLINE)
      {
        this.alert.info('Invitation has been removed');
      }

    }, (err: HttpErrorResponse) =>
    {
      console.log(err);
    })
  }

}


export enum PerformInvitationAction
{
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE'
}