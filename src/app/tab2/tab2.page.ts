import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CollectionsService } from '../services/collections/collections.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public loading: HTMLIonLoadingElement;

  activeMembers = 0;
  totalMembers = 0;
  todayCollection = 0;
  totalCollection = 0;

  users = [];
  isShow = false;

  features: any[] = [
    { id: 1, name: 'Active Members', src: 'activeMembers', background: 'rgba(27,150,181, 0.1)', page: '/view-all-members/active' },
    { id: 2, name: 'Total Members', src: 'totalMembers', background: 'rgba(106,100,255, 0.1)', page: '/view-all-members/all' },
    { id: 3, name: 'Today Collection', src: 'todayCollection', background: 'rgba(255, 196, 9, 0.1)', page: '/view-all-payments/today' },
    { id: 4, name: 'Total Collection', src: 'totalCollection', background: 'rgba(27,150,181, 0.1)', page: '/view-all-payments/all' },
  ];

  transactions: any[] = [
    { id: 1, vendor: 'Received from PhonePe', image: '', amount: 1500, time: '3:00PM' },
    { id: 2, vendor: 'Flaticons', image: '', amount: -1200, time: '4:00PM' }
  ];

  constructor(private userService: UserService, private collectionService: CollectionsService, private router: Router,
    private loadingController: LoadingController, private alertController: AlertController, private authService: AuthService) {
    this.calculateStats();
  }

  async logout() {
    // await this.authService.logOut();
    await this.authService.signout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  retrieveUsers(status?: string) {
    return this.userService.getAllUsers(status).get().toPromise();
  }

  retrievePayments(timeline?: string) {
    return this.collectionService.getAllUserPayments(timeline).get().toPromise();
  }

  async calculateStats() {
    try {
      await this.showLoading();

      this.activeMembers = 0;
      this.totalMembers = 0;
      this.todayCollection = 0;
      this.totalCollection = 0;

      const activeVal = await this.retrieveUsers('active');
      this.activeMembers = activeVal.size;
      const totalVal = await this.retrieveUsers('all');
      this.totalMembers = totalVal.size;

      const todayCol = await this.retrievePayments('today');
      const totalCol = await this.retrievePayments('all');

      todayCol.forEach(item => {
        this.todayCollection += item.data().amount ? item.data().amount : 0;
      });
      totalCol.forEach(item => {
        this.totalCollection += item.data().amount ? item.data().amount : 0;
      });

      this.isShow = true;
      await this.hideLoading();
    } catch (error) {
      console.error(error);
      this.handleError(error);
      await this.hideLoading();
    }
  }

  showStats(source) {
    if (source === 'activeMembers') {
      return this.activeMembers;
    }
    if (source === 'totalMembers') {
      return this.totalMembers;
    }
    if (source === 'todayCollection') {
      return '₹ ' + this.todayCollection;
    }
    if (source === 'totalCollection') {
      return '₹ ' + this.totalCollection;
    }
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
