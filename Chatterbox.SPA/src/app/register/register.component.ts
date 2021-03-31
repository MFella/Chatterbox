import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../_services/alert.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private alert: AlertService,
    private authServ: AuthService, private router: Router) { }

  ngOnInit() {
    this.initForm();

  }

  
  private initForm(): void
  {
    this.registerForm = this.fb.group
    ({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[A-Za-z]+$/)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[A-Za-z]+$/)]],
      dateOfBirth: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), 
        Validators.pattern(/^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i)]],
      country: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100), Validators.pattern(/^[A-Za-z]+$/)]],
      email: ['', [Validators.required, 
        Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
      login: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25), Validators.pattern(/^[a-zA-Z0-9_.-]*$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(/^[\w\[\]`!@#$%\^&*()={}:;<>+'-]*$/)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(/^[\w\[\]`!@#$%\^&*()={}:;<>+'-]*$/)]]
    }, {validators: [this.passMatch, this.isFullAge]})

  }

  private passMatch(fg: FormGroup): null | Object
  {
    return fg.get('password')!.value.normalize() === fg.get('repeatPassword')!.value.normalize() ? null:
    {
      'mismatchPassword': true
    }
  }

  private isFullAge(fg: FormGroup): null | Object
  {

    const today = new Date();
    const birthDate = new Date(fg.get('dateOfBirth')?.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if(m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
    {
      age--;
    }

    return age >= 18? null : 
    {
      'notFullAge': true
    }

  }

  submit(): void
  {
    const forRegister = Object.assign({}, this.registerForm.value);

    this.authServ.register(forRegister)
    .subscribe(res =>
      {
        this.alert.success('You have been registered successfully!');
        this.router.navigate([''])
      }, err =>
      {
        console.log(err);
        this.alert.error('Something went wrong');
      })
  }

}
