import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

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
    })
  }

}
