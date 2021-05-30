import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserListRecordDto } from '../dtos/userListRecord.dto';
import { AlertService } from '../_services/alert.service';
import { MessagesService } from '../_services/messages.service';

@Injectable({
  providedIn: 'root'
})
export class UserListResolver implements Resolve<UserListRecordDto[]> {

  constructor(private msgServ: MessagesService, private alert: AlertService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserListRecordDto[]> {
    return this.msgServ.getUserList()
    .pipe(catchError((err: any) =>
    {
      this.alert.error('Cant fetch user list');
      return of([]);
    }))
  }
}
