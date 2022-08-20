import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllMembersPage } from './view-all-members.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllMembersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllMembersPageRoutingModule {}
