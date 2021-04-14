import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { SweetyService } from '../_services/sweety.service';

@Injectable({
  providedIn: 'root'
})
export class RoomGuard implements CanActivate {

  constructor(private authServ: AuthService, private sweety: SweetyService){}

  async canActivate():  Promise<boolean | UrlTree> {
    
      if(this.authServ.userStored !== null)
      {
        return true;
      }else
      {
        const trueRes =  await this.sweety.submitNickname(this.authServ.checkNickname);

        return trueRes;


      }

   // return true;
  }
  
}
