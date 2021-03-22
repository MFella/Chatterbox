import { Component, OnInit } from '@angular/core';
import { faUsers, faListAlt, faQuestion, faSignInAlt, faUserTie, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public icons: Array<IconDefinition> = [faUserTie, faListAlt, faSignInAlt, faQuestion, faUsers]


  constructor() {}

  ngOnInit()
  {

  }


}
