import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appPages = [
    {
      title: 'Home',
      url: 'tabs/home',
      icon: 'home'
    },
    {
      title: 'Profile',
      url: 'tabs/profile',
      icon: 'person'
    },
    {
      title: 'Total Members',
      url: 'view-all-members/all',
      icon: 'people'
    },
    {
      title: 'Active Members',
      url: 'view-all-members/active',
      icon: 'people'
    },
    {
      title: 'Expired Members',
      url: 'view-all-members/expired',
      icon: 'people'
    },
    {
      title: 'Today Collection',
      url: 'view-all-payments/today',
      icon: 'wallet'
    },
    {
      title: 'Total Collection',
      url: 'view-all-payments/all',
      icon: 'wallet'
    },
  ];
  constructor() { }
}
