import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCollectionsPageRoutingModule } from './list-collections-routing.module';

import { ListCollectionsPage } from './list-collections.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCollectionsPageRoutingModule
  ],
  declarations: [ListCollectionsPage]
})
export class ListCollectionsPageModule {}
