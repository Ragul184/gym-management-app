import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-init-payment',
  templateUrl: './init-payment.page.html',
  styleUrls: ['./init-payment.page.scss'],
})
export class InitPaymentPage implements OnInit {

  payForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.payForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[a-zA-Z]*')])),
      lastName: new FormControl('', Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z]*')])),
      email: new FormControl('',
        Validators.compose([Validators.required, Validators.pattern('[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])),
      mobileNumber: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')])),
      plan: new FormControl('1'),
      mode: new FormControl('1'),
    });
  }

  get firstName() {
    return this.payForm.get('firstName');
  }
  get lastName() {
    return this.payForm.get('lastName');
  }
  get email() {
    return this.payForm.get('email');
  }
  get mobileNumber() {
    return this.payForm.get('mobileNumber');
  }
  get plan() {
    return this.payForm.get('plan');
  }
  get mode() {
    return this.payForm.get('mode');
  }

  ngOnInit() {
  }




  initPay() {
    console.table('result', this.payForm.value);
  }
}
