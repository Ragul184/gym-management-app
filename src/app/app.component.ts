import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appPages=[
    {
      title: 'Profile',
      url: 'profile',
      icon: 'person'
    },
    {
      title: 'Total Members',
      url: 'profile',
      icon: 'person'
    },
    {
      title: 'Active Members',
      url: 'profile',
      icon: 'person'
    },
    {
      title: 'Expired Members',
      url: 'profile',
      icon: 'person'
    },
    {
      title: 'Total Collection',
      url: 'profile',
      icon: 'person'
    },
  ];
  labels=['Label1','Label2','Label3'];
  constructor() {}
}
