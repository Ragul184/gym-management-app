import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private authService: AuthService, private router: Router, private alertController: AlertController) { }

  async logout() {
    // await this.authService.logOut();
    await this.authService.signout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async exitApp() {
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
