import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCollectionsPage } from './list-collections.page';

const routes: Routes = [
  {
    path: '',
    component: ListCollectionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCollectionsPageRoutingModule {}
