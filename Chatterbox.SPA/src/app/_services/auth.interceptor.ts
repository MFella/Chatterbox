import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authServ: AuthService, private router: Router,
    private alert: AlertService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = localStorage.getItem('id_token');


    if(idToken)
    {
      const cloned = request.clone({
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + idToken
        })

      });
      return next.handle(cloned)
      .pipe(catchError((response: HttpErrorResponse) =>
      {
        if(response instanceof HttpErrorResponse && response.status === 401)
        {
          this.router.navigate(['']);
          this.authServ.logout();
          this.alert.error('Session expired - try to log in again');
        }

        return throwError(response);

      }))
    }else {

      return next.handle(request);
      
    }
  }
}
