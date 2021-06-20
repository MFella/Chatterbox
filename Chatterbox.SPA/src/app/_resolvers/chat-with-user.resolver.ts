import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FriendsToChatDto } from '../dtos/friendsToChat.dto';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatWithUserResolver implements Resolve<FriendsToChatDto[]> {

  constructor(private authServ: AuthService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FriendsToChatDto[]> {
    return this.authServ.getFriends()
    .pipe(catchError((err) =>
    {
      return of([]);
    }))
  }
}
