import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUsers, faListAlt, faQuestion, faSignInAlt, 
  faUserTie, faUserPlus, faDoorOpen, faIdBadge, faCommentDots, IconDefinition, faInbox, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public icons: Array<IconDefinition> = [faUserTie, faListAlt, faSignInAlt, faQuestion, faUsers, 
    faUserPlus, faDoorOpen, faIdBadge, faCommentDots, faInbox, faLocationArrow]


  constructor(public authServ: AuthService, private router: Router) {}

  ngOnInit()
  {

  }

  logout()
  {
    this.authServ.logout()
    .subscribe((res: any) =>
    {
      console.log(res);
      this.router.navigate(['']);
    }, (err: any) =>
    {
      console.log(err);
    })
  }
}
