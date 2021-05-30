import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../_services/alert.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<Object> {

  constructor(private authServ: AuthService, private alert: AlertService,
    private router: Router){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> {
    
    console.log(route.queryParams.id)
    return this.authServ.getProfileDetails(route.queryParams.id ?? '')
    .pipe(catchError((err: any) => 
    {
      this.alert.error('Invalid id of user');
      this.router.navigate(['']);
      return of({});
    }));
  }
}
