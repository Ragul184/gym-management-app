import { Component, ViewChild } from '@angular/core';
import { IonTabs, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  @ViewChild(IonTabs, { static: true }) private ionTabs: IonTabs;

  constructor(private platform: Platform, private router: Router, private location: Location) {

    this.platform.backButton.subscribeWithPriority(-1, (processNextHandler) => {
      console.log('Check if go back: ', this.ionTabs.outlet.canGoBack());
      if (this.ionTabs.outlet && this.ionTabs.outlet.canGoBack()) {
        console.log('Calling if tabs: ', this.ionTabs.outlet.stackEvents, this.ionTabs.outlet.swipeGesture, this.ionTabs.outlet.tabsPrefix);
        this.ionTabs.outlet.pop();
      }
      // else if (!this.location.isCurrentPathEqualTo('/tabs/home')) {
      //   console.log('Calling outlet: ',this.ionTabs.outlet.stackEvents,this.ionTabs.outlet.swipeGesture, this.ionTabs.outlet.tabsPrefix);
      //   console.log('Not In Home Page', router.url, this.ionTabs.outlet.getLastRouteView());
      //   this.router.navigate(['/tabs/home'], { replaceUrl: true });
      // }
      else {
        console.log('In Home page, moving to app handler');
        processNextHandler();
      }
    });
  }

}
