import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListMemberPage } from './list-member.page';

const routes: Routes = [
  {
    path: '',
    component: ListMemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListMemberPageRoutingModule {}
