import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageToSendDto } from '../dtos/messageToSend.dto';
import { ResolvedUserListDto } from '../dtos/resolvedUserList.dto';
import { UserListRecordDto } from '../dtos/userListRecord.dto';
import { MessagesService } from '../_services/messages.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {

  userList: UserListRecordDto[] = [];
  messageForm!: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private msgServ: MessagesService) { }

  ngOnInit() {


    this.route.data
    .subscribe((res: any) => 
    {
      console.log(res);
      this.userList = res.users;
      this.initForm();
    })

    setTimeout(() => 
    {
      console.log(this.userList);
    }, 500)
  }

  initForm()
  {
    this.messageForm = this.fb.group({
      typeOfMessage: ['NORMAL_MESSAGE', [Validators.required]],
      receiver: [, [Validators.required]],
      subject: ['', [Validators.required, Validators.nullValidator]],
      contentNormal: ['', [Validators.required]],
      contentInvitation: ['Hello buddy, I want to be your friend. Cheers!', [Validators.required]],
      contentDeletion: ['I have to remove you. Sorry about that.', [Validators.required]]
    })
  }

  onSubmit()
  {
    console.log(this.messageForm.get('typeOfMessage')?.value);
    const {contentNormal, contentInvitation, contentDeletion, ...rest} = this.messageForm.value;
    const content = rest.typeOfMessage === 1 ? contentNormal : (rest.typeOfMessage === 2 ? contentInvitation : contentDeletion);
    const messageToSendDto: MessageToSendDto = {...rest, content};

    this.msgServ.sendMessage(messageToSendDto)
    .subscribe((res: any) =>
    {

    }, (err: any) =>
    {
      console.log(err);
    })
  }


}
