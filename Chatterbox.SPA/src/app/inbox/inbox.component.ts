import { Component, OnInit } from '@angular/core';
import { faCheck, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  constructor() { }

  public icons: Array<IconDefinition> = [faCheck, faTimes];
  
  ngOnInit() {
  }

}
