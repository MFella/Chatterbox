import { Injectable } from '@angular/core';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class SweetyService {

  constructor() { }

  submitNickname(callback: CallableFunction): boolean
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
      const res = callback(value);
      return res;
    })
    .catch((err: Error) =>
    {
      return false;
    })

    return false;
  }


}
