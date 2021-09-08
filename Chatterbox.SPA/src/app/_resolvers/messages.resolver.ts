import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageToReturnDto } from '../dtos/messageToReturn.dto';
import { MessagesService } from '../_services/messages.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesResolver implements Resolve<boolean | MessageToReturnDto[]> {

  constructor(private msgServ: MessagesService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | MessageToReturnDto[]> {
    return this.msgServ.getMessages()
    .pipe(catchError((error) => {
      return of(false);
    }))
  } 
}
