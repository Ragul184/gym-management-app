import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllPaymentsPageRoutingModule } from './view-all-payments-routing.module';

import { ViewAllPaymentsPage } from './view-all-payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllPaymentsPageRoutingModule
  ],
  declarations: [ViewAllPaymentsPage]
})
export class ViewAllPaymentsPageModule {}
