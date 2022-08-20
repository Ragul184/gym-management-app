import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllPaymentsPage } from './view-all-payments.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllPaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllPaymentsPageRoutingModule {}
