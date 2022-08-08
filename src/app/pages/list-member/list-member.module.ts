import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListMemberPageRoutingModule } from './list-member-routing.module';

import { ListMemberPage } from './list-member.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListMemberPageRoutingModule
  ],
  declarations: [ListMemberPage]
})
export class ListMemberPageModule {}
