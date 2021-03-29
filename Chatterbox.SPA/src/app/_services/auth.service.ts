import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserForRegisterDto } from '../dtos/userForRegister.dto';
import {environment as env} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(userForRegisterDto: UserForRegisterDto)
  {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');


    return this.http.post(env.backUrl, userForRegisterDto, {headers});

  }


}
