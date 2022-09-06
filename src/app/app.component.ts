import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AlertController, Platform, IonRouterOutlet } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
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
  constructor(private alertController: AlertController, private platform: Platform,
    private location: Location, private router: Router) {
    this.backButtonEvent();
  }

  backButtonEvent() {
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   this.backButtonAlert();
    // });

    this.platform.backButton.subscribeWithPriority(-1, async () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        console.log(this.routerOutlet);
        this.routerOutlet.pop();
        // this.location.back();

        // if (this.location.isCurrentPathEqualTo('/home') || this.location.isCurrentPathEqualTo('/tabs/home')) {
        //   this.backButtonAlert();
        // }

      } else if (!this.location.isCurrentPathEqualTo('/tabs/home')) {
        console.log('Not In Home Page');
        this.router.navigate(['/tabs/home'], { replaceUrl: true });
      }
      else {
        if (this.platform.is('android' || 'capacitor')) {
          return App.minimizeApp();
        }
        return this.backButtonAlert();
      }
    });
  }

  async backButtonAlert() {
    const alert = await this.alertController.create({
      header: 'Exit App?',
      message: 'Do you really want to close the app?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Exit',
        handler: () => {
          App.exitApp();
        }
      }]
    });

    await alert.present();
  }
}
