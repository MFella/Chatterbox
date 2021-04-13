import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RoomDto } from '../dtos/room.dto';
import { AlertService } from '../_services/alert.service';
import { ChatService } from '../_services/chat.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelListResolver implements Resolve<boolean | RoomDto[]> {

  constructor(public chatServ: ChatService, private router: Router,
    private alert: AlertService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | RoomDto[]> {

    return this.chatServ.getRoomList()
    .pipe(
      catchError((err: HttpErrorResponse) =>
      {
        this.alert.error("Error occured during retriving data");
        this.router.navigate(['']);
        return of(false);
      })
    )
  }
}
