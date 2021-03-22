import { Component, OnInit } from '@angular/core';
import { IconDefinition, faUser, faKey } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public icons: Array<IconDefinition> = [faUser, faKey];

  constructor() { }

  ngOnInit() {
  }

}
