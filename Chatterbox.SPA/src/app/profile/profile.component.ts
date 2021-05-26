import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Profile } from '../_models/profile.interface';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile!: Profile

  constructor(private route: ActivatedRoute, private authServ: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe((res: any) =>
    {
      this.profile = res.profile;
    })
  }

}
