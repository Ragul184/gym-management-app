import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InitPaymentPageRoutingModule } from './init-payment-routing.module';

import { InitPaymentPage } from './init-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InitPaymentPageRoutingModule
  ],
  declarations: [InitPaymentPage]
})
export class InitPaymentPageModule { }
