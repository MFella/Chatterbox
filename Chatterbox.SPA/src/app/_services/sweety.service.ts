import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SweetyService {



  constructor(private authServ: AuthService) { }

  async submitNickname(): Promise<string> 
  {

    const {value: nick} = await Swal.fire({
      title: 'Type your nick instead, or try to login',
      input: 'text',
      inputLabel: 'Your volatile nickname',
      inputPlaceholder: 'e.g. Brawler1523',
      showCloseButton: true
    });

    if(nick === undefined)
    {
      return '';
    }

    return nick;
  }


}
