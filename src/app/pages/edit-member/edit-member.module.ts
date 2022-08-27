import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMemberPageRoutingModule } from './edit-member-routing.module';

import { EditMemberPage } from './edit-member.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    EditMemberPageRoutingModule
  ],
  declarations: [EditMemberPage]
})
export class EditMemberPageModule {}
