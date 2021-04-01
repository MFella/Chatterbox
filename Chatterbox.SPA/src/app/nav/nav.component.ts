import { Component, OnInit } from '@angular/core';
import { faUsers, faListAlt, faQuestion, faSignInAlt, 
  faUserTie, faUserPlus, faDoorOpen, faIdBadge, faCommentDots, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public icons: Array<IconDefinition> = [faUserTie, faListAlt, faSignInAlt, faQuestion, faUsers, faUserPlus, faDoorOpen, faIdBadge, faCommentDots]


  constructor(public authServ: AuthService) {}

  ngOnInit()
  {

  }
}
