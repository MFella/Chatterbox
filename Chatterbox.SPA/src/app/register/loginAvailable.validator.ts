import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

export class LoginAvailableValidator
{
    static checkAvailability(authServ: AuthService): AsyncValidatorFn
    {
        return (loginCtrl: AbstractControl | null): Observable<ValidationErrors | null> => {
            return authServ.checkAvailabilityOfLogin(loginCtrl?.value).pipe(
                map(
                    (res: boolean) => {
                        return res ? null : {'loginNotAvailable': true}
                    })
            )
        }
    }
}