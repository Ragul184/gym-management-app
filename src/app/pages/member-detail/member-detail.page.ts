import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { UserPaymentInfo } from 'src/app/model/userPaymentInfo';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.page.html',
  styleUrls: ['./member-detail.page.scss'],
})
export class MemberDetailPage implements OnInit {

  mId = '';
  paymentDetail: UserPaymentInfo;
  retrievedUser: User;
  public loading: HTMLIonLoadingElement;

  constructor(private route: ActivatedRoute, private collectionService: CollectionsService, private userService: UserService,
    private alertController: AlertController, private loadingController: LoadingController) {
    this.mId = this.route.snapshot.paramMap.get('memberId');
    this.getUser(this.mId);
  }

  ngOnInit() { }

  async getUser(memberId: string) {
    try {
      await this.showLoading();
      const userRef = await this.userService.getUserByMemberId(memberId).get().toPromise();
      userRef.forEach(res => {
        this.retrievedUser = { id: res.id, ...res.data() };
      });
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
      this.loading = await this.loadingController.create({
        message: 'Just a moment...',
        mode: 'ios'
      });
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
