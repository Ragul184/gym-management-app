import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowExpiringMembersPage } from './show-expiring-members.page';

const routes: Routes = [
  {
    path: '',
    component: ShowExpiringMembersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowExpiringMembersPageRoutingModule {}
