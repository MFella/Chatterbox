import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, of, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, filter, map, distinctUntilChanged } from 'rxjs/operators';
import { AlertService } from '../_services/alert.service';
import { AuthService } from '../_services/auth.service';
import { EmailAvailableValidator } from './emailAvailable.validator';
import { LoginAvailableValidator } from './loginAvailable.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  countries!: Array<string>;

  @ViewChild('instance', {static: true}) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(private fb: FormBuilder, private alert: AlertService,
    private authServ: AuthService, private router: Router) { }

  ngOnInit() {
    this.initForm();

    this.authServ.getCountries()
      .subscribe((res: Array<string>) =>
        {
          this.countries = res;
        })

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
      email: ['', { validators: [Validators.required, 
        Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)],
      asyncValidators: [EmailAvailableValidator.checkAvailability(this.authServ)]}],
      login: ['', { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(25), 
        Validators.pattern(/^[a-zA-Z0-9_.-]*$/)],
      asyncValidators: [LoginAvailableValidator.checkAvailability(this.authServ)]}],
        // have to work on it
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(/^(?=\D*\d)(?=.*?[a-zA-Z]).*[\W_].*$/)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(/^(?=\D*\d)(?=.*?[a-zA-Z]).*[\W_].*$/)]]
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

  // checkAvailability(login: AbstractControl | null, serv: AuthService): any 
  // {

  //   console.log(login);
  //   if(login?.status.normalize() === 'VALID')
  //   {

  //     serv.checkAvailabilityOfLogin(login?.value)
  //       .subscribe((res: boolean) =>
  //       {

  //         return res? null:
  //         {
  //           'loginNotAvailable': true
  //         }
  //       });

  //       return null;

  //   } else return null;
  // }

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
    console.log(this.registerForm.get('login')?.errors?.loginNotAvailable)
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term: string) => (term === '' ? this.countries
        : this.countries.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

}

