import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPaymentInfoPage } from './edit-payment-info.page';

const routes: Routes = [
  {
    path: '',
    component: EditPaymentInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPaymentInfoPageRoutingModule {}
