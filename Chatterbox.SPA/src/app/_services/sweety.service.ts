import { Injectable } from '@angular/core';
import swal from 'sweetalert';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SweetyService {



  constructor(private authServ: AuthService) { }

  async submitNickname(): Promise<boolean | void> 
  {
    
    swal("???", {
      title: 'Who are you?',
      text: "To be able to talk, you need to provide a unique nickname",
      content: {
        element: 'input'
      }
    } as any)
    .then((value: string) =>
    {
      this.authServ.checkNickname(value)
      .subscribe((res: any) =>
      {
        console.log(res);

      }, (err: any) =>
      {
        return false;
      })
      //return res;
    })
    .catch((err: Error) =>
    {
      console.log(err);
      return false;
    })

    //return false;
  }


}
