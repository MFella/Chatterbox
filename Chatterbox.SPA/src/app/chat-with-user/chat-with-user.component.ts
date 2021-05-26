import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-with-user',
  templateUrl: './chat-with-user.component.html',
  styleUrls: ['./chat-with-user.component.scss']
})
export class ChatWithUserComponent implements OnInit {

  userListStyle: string = 'My friends';

  constructor() { }

  ngOnInit() {
  }

  changeListStyle()
  {
    // default
    if(this.userListStyle === 'My friends')
    {
      this.userListStyle = 'Online';

    } else this.userListStyle = 'My friends';

  }

}
