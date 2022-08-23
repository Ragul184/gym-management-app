import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMemberPageRoutingModule } from './add-member-routing.module';

import { AddMemberPage } from './add-member.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddMemberPageRoutingModule
  ],
  declarations: [AddMemberPage]
})
export class AddMemberPageModule { }
