import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllMembersPageRoutingModule } from './view-all-members-routing.module';

import { ViewAllMembersPage } from './view-all-members.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllMembersPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [ViewAllMembersPage]
})
export class ViewAllMembersPageModule {}
