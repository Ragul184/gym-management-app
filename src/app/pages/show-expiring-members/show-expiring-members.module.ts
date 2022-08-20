import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowExpiringMembersPageRoutingModule } from './show-expiring-members-routing.module';

import { ShowExpiringMembersPage } from './show-expiring-members.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowExpiringMembersPageRoutingModule
  ],
  declarations: [ShowExpiringMembersPage]
})
export class ShowExpiringMembersPageModule {}
