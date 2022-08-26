import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatePaymentPageRoutingModule } from './update-payment-routing.module';

import { UpdatePaymentPage } from './update-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    UpdatePaymentPageRoutingModule
  ],
  declarations: [UpdatePaymentPage]
})
export class UpdatePaymentPageModule { }
