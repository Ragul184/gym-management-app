import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { UserPaymentInfo } from 'src/app/model/userPaymentInfo';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public loading: HTMLIonLoadingElement;
  retrievedUser: any;

  constructor(private authService: AuthService, private router: Router,
    private route: ActivatedRoute, private collectionService: CollectionsService, private userService: UserService,
    private alertController: AlertController, private loadingController: LoadingController) {
    this.getCurrentUserProfile();
  }

  async logout() {
    // await this.authService.logOut();
    await this.authService.signout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  ngOnInit() { }

  async getCurrentUserProfile() {
    try {
      await this.showLoading();
      const userDoc = await this.authService.getCurrentUserProfile();
      this.retrievedUser = { id: userDoc.id, ...userDoc.data() };
      console.log('Retrieved User: ', this.retrievedUser);
      await this.hideLoading();

    } catch (error) {
      console.error(error);
      this.handleError(error);
      await this.hideLoading();
    }
  }

  changeToDate(date: string) {
    return new Date(date);
  }

  // LOADERS AND ALERTS
  async showLoading(): Promise<void> {
    try {
      this.loading = await this.loadingController.create();
      await this.loading.present();
    } catch (error) {
      this.handleError(error);
    }
  }

  hideLoading(): Promise<boolean> {
    return this.loading.dismiss();
  }

  async handleError(error: { message: any }): Promise<void> {
    const alert = await this.alertController.create({
      message: error.message,
      buttons: [{ text: 'Ok', role: 'cancel' }]
    });
    await alert.present();
  }

}
