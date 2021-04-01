import { Injectable } from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

constructor(private alert: ToastrService) { }

  success(msg: string): void
  {
    this.alert.success(msg, 'Success');

  }

  error(msg: string): void
  {
    this.alert.error(msg, 'Error');
  }

  info(msg: string): void
  {
    this.alert.info(msg, 'Info');
  }

}

