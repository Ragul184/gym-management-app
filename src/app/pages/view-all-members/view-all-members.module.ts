import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllMembersPageRoutingModule } from './view-all-members-routing.module';

import { ViewAllMembersPage } from './view-all-members.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllMembersPageRoutingModule
  ],
  declarations: [ViewAllMembersPage]
})
export class ViewAllMembersPageModule {}
