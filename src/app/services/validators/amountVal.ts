import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DEFAULT_FEE_AMOUNT } from 'src/app/pages/add-member/add-member.page';

export const feeAmountValidator = (controlName: string): ValidationErrors | null =>
    (controls: AbstractControl) => {
        const control = controls.get(controlName);
        if (control.value % DEFAULT_FEE_AMOUNT === 0) {
            return control.setErrors({ correctAmount: true });
        } else {
            return control.setErrors(null);
        }
    };
