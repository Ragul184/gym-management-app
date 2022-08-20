import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  activeMembers: number = 0;
  totalMembers: number = 0;
  todayCollection: number = 0;
  totalCollection: number = 0;

  constructor(private menuController: MenuController) {
    // this.menuController.enable(true);
  }

}
