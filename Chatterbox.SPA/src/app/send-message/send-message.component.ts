import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageToSendDto } from '../dtos/messageToSend.dto';
import { ResolvedUserListDto } from '../dtos/resolvedUserList.dto';
import { UserListRecordDto } from '../dtos/userListRecord.dto';
import { AlertService } from '../_services/alert.service';
import { MessagesService } from '../_services/messages.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {

  @ViewChild('contentMsg') contentMsg!: ElementRef;
  userList: UserListRecordDto[] = [];
  savedNormalMessage: string = '';
  messageForm!: FormGroup;


  constructor(private route: ActivatedRoute, private fb: FormBuilder, private msgServ: MessagesService,
    private alert: AlertService) { }

  ngOnInit() {


    this.route.data
    .subscribe((res: any) => 
    {
      console.log(res);
      this.userList = res.users;
      this.initForm();
    })

  }

  initForm()
  {
    this.messageForm = this.fb.group({
      typeOfMessage: ['NORMAL_MESSAGE', [Validators.required]],
      receiverId: [, [Validators.required]],
      title: ['', [Validators.required, Validators.nullValidator]],
      content: ['', [Validators.required]],
      // contentInvitation: ['Hello buddy, I want to be your friend. Cheers!', [Validators.required]],
      // contentDeletion: ['I have to remove you. Sorry about that.', [Validators.required]]
    })
  }

  onSubmit()
  {
    let messageToSendDto: MessageToSendDto = {...this.messageForm.getRawValue()};
    this.msgServ.sendMessage(messageToSendDto)
    .subscribe((res: boolean) =>
    {
        console.log(res);
        if(res)
        {
          this.alert.success('Message has been sent');
          this.messageForm.reset();
          this.messageForm.get('typeOfMessage')?.setValue('NORMAL_MESSAGE');
        }
        else
        {
          this.alert.error('Cant save message');
        }

    }, (err: HttpErrorResponse) =>
    {
      this.alert.error(err.error.message);
    })
  }

  onChangeModel(e: any)
  {
    const content = this.messageForm.get('content');
    const typeOfMessage: MessageToSendDto = this.messageForm.get('typeOfMessage')?.value;

    switch(e)
    {
      case 'NORMAL_MESSAGE':
        content?.setValue('');
        content?.enable();
        this.contentMsg.nativeElement.setAttribute('rows', 10);
      break;
      case 'INVITATION':
        content?.setValue('Hello buddy, I want to be your friend. Cheers!');
        content?.disable();
        this.contentMsg.nativeElement.setAttribute('rows', 3);
      break;
      case 'DELETION':
        content?.setValue('I have to remove you. Sorry about that.');
        content?.disable();
        this.contentMsg.nativeElement.setAttribute('rows', 3);
      break;
      default:
      break;
    }
  }
}
