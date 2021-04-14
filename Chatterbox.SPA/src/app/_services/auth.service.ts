import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserForRegisterDto } from '../dtos/userForRegister.dto';
import {environment as env} from '../../environments/environment';
import {map, shareReplay, tap} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserForLoginDto } from '../dtos/userForLogin.dto';
import { UserStored } from '../_models/userStored.interface';
import * as moment from 'moment';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private alert: AlertService) { 
    this.userStored = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}'): null;
  }

  userStored!: UserStored | null;

  checkAvailabilityOfLogin(login: string): Observable<boolean>
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.get<boolean>(env.backUrl + `auth/check-login?login=${login}`, {headers});
  }

  checkAvailabilityOfEmail(email: string): Observable<boolean>
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.get<boolean>(env.backUrl + `auth/check-email?email=${email}`, {headers});
  }

  register(userForRegisterDto: UserForRegisterDto) : Observable<void>
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post<void>(env.backUrl + 'auth/register', userForRegisterDto, {headers});
  }

  login(userForLoginDto: UserForLoginDto): Observable<void>
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post<void>(env.backUrl + 'auth/login', userForLoginDto, {headers})
    .pipe(
      tap((r: any) => this.setSession(r)),
      shareReplay(),
      map((res: any) =>
      {
        if(res.resp.user)
        {

          this.userStored = res.resp.user;
        }

        return res;

      })
    )
  }

  checkNickname(nickname: string): Observable<boolean>
  {

    return this.http.get<boolean>(env.backUrl + `auth/check-nickname?login=${nickname}`)
    .pipe(
      map((res: any) =>
      {
        console.log(`Res from checkNickname: ${res}`);
        return res;
      })
    )
  }

  private setSession(authRes: any)
  {
    this.userStored = authRes.resp.user;
    const expireDate = moment().add(authRes.resp.expiresIn, 'second');
    localStorage.setItem('user', JSON.stringify(this.userStored));
    localStorage.setItem('id_token', authRes.resp.access_token);
    localStorage.setItem('expires_at', JSON.stringify(expireDate.valueOf()));
  }

  logout()
  {
    this.userStored = null;
    // localStorage.removeItem('user');
    // localStorage.removeItem('id_token');
    // localStorage.removeItem('expires_at');
    localStorage.clear();
    this.alert.info('You have been logged out successfully');
    return this.http.get(env.backUrl + 'auth/track-logout');
  }

  getCountries()
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get(env.countriesUrl, {headers})
    .pipe(
      map((res: any) =>
      {      

        let namesOnly = res.map((item: any) =>
        {   
          return item['name'];

        }).filter((el: string) =>
        {
          return /^[A-Za-z]+$/.test(el);
        });

        return namesOnly;
      })
    )
  }


}
