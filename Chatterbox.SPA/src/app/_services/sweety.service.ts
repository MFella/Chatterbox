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

    return nick ?? '';
  }

  async changeVolatileNickname(currNickname: string): Promise<string>
  {

    const {value: nick} = await Swal.fire({
      title: 'Change your volatile nickname',
      input: 'text',
      inputValue: currNickname,
      inputLabel: 'Remember about appropriate pattern',
      //inputPlaceholder: 'e.g. Brawler1523',
      showCloseButton: true
    });

    console.log(nick);

    return nick ?? '';
    
  }
}
// TODO: change of nickname = change of nick in activeRepo