import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AlertService } from '../_services/alert.service';
import { AuthService } from '../_services/auth.service';
import { SweetyService } from '../_services/sweety.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authServ: AuthService, private sweety: SweetyService, private router: Router,
    private alert: AlertService){}

  async canActivate():  Promise<boolean>{

    try{
    this.authServ.isTokenExpired()
      .subscribe((res: boolean) => 
      { 
        if(!res)
        {
          this.authServ.currNickname = null;
          this.authServ.userStored = null;
          this.authServ.logout();
          this.router.navigate(['']);
        }
        return res;
      }, (err: any) => {
        return false;
      });
  }
  catch(e)
  {
    return false;

  }finally{

    if(this.authServ.userStored)
    {
      return true;
      
    }else{
      this.router.navigate(['']);
      this.alert.info('You are not logged in!');
      return false;
    }

  }
  
  }
}
