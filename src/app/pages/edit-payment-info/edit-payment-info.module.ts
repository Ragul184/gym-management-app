import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPaymentInfoPageRoutingModule } from './edit-payment-info-routing.module';

import { EditPaymentInfoPage } from './edit-payment-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    EditPaymentInfoPageRoutingModule
  ],
  declarations: [EditPaymentInfoPage]
})
export class EditPaymentInfoPageModule {}
