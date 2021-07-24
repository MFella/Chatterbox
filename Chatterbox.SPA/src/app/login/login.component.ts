import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IconDefinition, faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { AlertService } from '../_services/alert.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public icons: Array<IconDefinition> = [faUser, faKey];
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authServ: AuthService,
    private alert: AlertService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void
  {
    this.loginForm = this.fb.group({
      login: ['', {validators: [Validators.required, Validators.minLength(5), Validators.maxLength(25), 
        Validators.pattern(/^[a-zA-Z0-9_.-]*$/)]}],
      password: ['', {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(30), 
        Validators.pattern(/^(?=\D*\d)(?=.*?[a-zA-Z]).*[\W_].*$/)]}]
    })
  }


  login()
  {
    if(this.loginForm.invalid) {
      this.alert.error('Fill in the from correctly');
      return;

    }
    const userCreds = Object.assign({}, this.loginForm.value);
    this.authServ.login(userCreds)
    .subscribe((res: any) =>
    {
      console.log(res);
      if(res.result)
      {
        this.router.navigate(['']);
        this.alert.success(res.msg);
      }else {

        this.alert.error('Some error occured');

      }
    }, (err: any) =>
    {
      console.log(err);
      if(err instanceof HttpErrorResponse)
      {
        this.alert.error(err.error?.message);
      }
    })
  }

}
