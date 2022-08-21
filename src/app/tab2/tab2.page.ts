import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  activeMembers = 0;
  totalMembers = 0;
  todayCollection = 0;
  totalCollection = 0;

  features: any[] = [
    { id: 1, name: 'Active Members', src: '0', background: 'rgba(27,150,181, 0.1)', page: '/view-all-members/active' },
    { id: 2, name: 'Total Members', src: '0', background: 'rgba(106,100,255, 0.1)', page: '/view-all-members/all' },
    { id: 3, name: 'Today Collection', src: '0', background: 'rgba(255, 196, 9, 0.1)', page: '/view-all-payments/today' },
    { id: 4, name: 'Total Collection', src: '0', background: 'rgba(27,150,181, 0.1)', page: '/view-all-payments/all' },
  ];

  transactions: any[] = [
    { id: 1, vendor: 'Received from PhonePe', image: '', amount: 1500, time: '3:00PM' },
    { id: 2, vendor: 'Flaticons', image: '', amount: -1200, time: '4:00PM' }
  ];

  constructor(private menuController: MenuController) {
    // this.menuController.enable(true);
  }

}
