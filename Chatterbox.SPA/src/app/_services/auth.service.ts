import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserForRegisterDto } from '../dtos/userForRegister.dto';
import {environment as env} from '../../environments/environment';
import {map, shareReplay, tap} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserForLoginDto } from '../dtos/userForLogin.dto';
import { RoleTypes, UserStored } from '../_models/userStored.interface';
import * as moment from 'moment';
import { AlertService } from './alert.service';
import { ChangeNickDto } from '../dtos/changeNick.dto';
import { FriendsToChatDto } from '../dtos/friendsToChat.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private alert: AlertService) { 
    this.userStored = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}'): null;
    const volatileNick = localStorage.getItem('volatileNick');
    this.currNickname = this.userStored !== null ? this.userStored.login : this.generateNick(volatileNick);
    console.log(this.currNickname)
  }

  userStored!: UserStored | null;
  currNickname!: string | null | undefined;

  generateNick(volatileNick: string | null): string
  {

    const fromStorage: string | null = localStorage.getItem('volatileNick') ;

    if(fromStorage !== null)
    {
      return fromStorage;
    }

    const random_suf: string = Math.random().toString(36).substring(5);
    const fullNick: string = "Guest_" + random_suf;
    localStorage.setItem('volatileNick', fullNick);
    return volatileNick !== null ? volatileNick : fullNick;
  }

  public set currNick(newNickname: string)
  {
    this.currNickname = newNickname;
  }

  trackActivity(nickOrLogin: string | null | undefined, roleType: RoleTypes, newLogin?: string): Observable<boolean>
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.get<boolean>(env.backUrl + `auth/track-activity?login=${nickOrLogin}&roleType=${roleType}&newLogin=${newLogin}`, {headers});
  }

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
          this.currNickname = this.userStored?.login;
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
        return res.res;
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
    localStorage.clear();
    return this.http.get(env.backUrl + `auth/track-logout?login=${this.currNickname}`);
  }

  changeVolatileNickname(changeNickDto: ChangeNickDto): Observable<boolean>
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.put<boolean>(env.backUrl + `auth/change-nick`, changeNickDto, {headers});
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

  getProfileDetails(id: string)
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get(env.backUrl + `auth/profile?id=${id}`, {headers});
  }

  isTokenExpired()
  {
    return this.http.get<boolean>(env.backUrl + 'auth/is-token-expired');
  }


  getFriends(): Observable<FriendsToChatDto[]>
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.get<FriendsToChatDto[]>(env.backUrl + `auth/friends`, {headers});
  }
}
