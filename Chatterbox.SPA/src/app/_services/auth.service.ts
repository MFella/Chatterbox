import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserForRegisterDto } from '../dtos/userForRegister.dto';
import {environment as env} from '../../environments/environment';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  checkAvailabilityOfLogin(login: string): Observable<boolean>
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.get<boolean>(env.backUrl + `auth/check-login?login=${login}`, {headers});
  }

  register(userForRegisterDto: UserForRegisterDto) : Observable<void>
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post<void>(env.backUrl + 'auth/register', userForRegisterDto, {headers});
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
