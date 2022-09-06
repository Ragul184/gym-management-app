import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllPaymentsPageRoutingModule } from './view-all-payments-routing.module';

import { ViewAllPaymentsPage } from './view-all-payments.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllPaymentsPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [ViewAllPaymentsPage]
})
export class ViewAllPaymentsPageModule { }
