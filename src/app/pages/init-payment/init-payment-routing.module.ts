import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitPaymentPage } from './init-payment.page';

const routes: Routes = [
  {
    path: '',
    component: InitPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitPaymentPageRoutingModule {}
