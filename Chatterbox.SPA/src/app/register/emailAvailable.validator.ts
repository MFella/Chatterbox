import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

export class EmailAvailableValidator
{
    static checkAvailability(authServ: AuthService): AsyncValidatorFn
    {
        return (emailCtrl: AbstractControl | null): Observable<ValidationErrors | null> => {
            return authServ.checkAvailabilityOfEmail(emailCtrl?.value).pipe(
                map(
                    (res: boolean) => {
                        return res ? null : {'emailNotAvailable': true}
                    })
            )
        }
    }
}