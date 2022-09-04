import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserPaymentInfo } from 'src/app/model/userPaymentInfo';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { Tab2Page } from 'src/app/tab2/tab2.page';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.page.html',
  styleUrls: ['./payment-detail.page.scss'],
})
export class PaymentDetailPage implements OnInit {
  public loading: HTMLIonLoadingElement;
  paymentId = '';
  paymentDetail: UserPaymentInfo;
  isShow = false;

  constructor(private route: ActivatedRoute, private collectionService: CollectionsService, private router: Router,
    private collectionsService: CollectionsService, private alertController: AlertController,
    private loadingController: LoadingController) {
    this.paymentId = this.route.snapshot.paramMap.get('paymentId');
    this.getTransactionWithId(this.paymentId);
  }

  ngOnInit() { }

  async getTransactionWithId(paymentId: string) {
    try {
      await this.showLoading();
      const paymentRef = await this.collectionService.getPaymentWithId(paymentId).get().toPromise();
      this.paymentDetail = { id: paymentRef.id, ...paymentRef.data() };
      this.isShow = true;
      await this.hideLoading();
    } catch (error) {
      console.error(error);
      this.handleError(error);
      await this.hideLoading();
    }
  }

  editPayment() {
    this.router.navigate(['edit-payment-info', this.paymentId]);
  }

  async deletePayment(paymentDetail: UserPaymentInfo) {
    console.log(`From DeleteMember: ID: ${paymentDetail.id}`);
    await this.showLoading();
    const inputAlert = await this.alertController.create({
      message: `Are you sure want to delete payment detail for this member ${paymentDetail.memberName}  \
                with id: ${paymentDetail.memberId}?`,
      buttons: [{
        text: 'Delete', handler: async () => {
          await this.showLoading();
          // DELETE PAYMENT HERE!
          await this.collectionsService.deleteUserPayment(paymentDetail.id);
          await this.router.navigate(['home']);
          await this.hideLoading();
          await this.handleError({ message: 'Payment Detail Succesfully Deleted!' });
        }
      }, { text: 'Cancel', role: 'cancel', }]
    });
    await this.hideLoading();
    await inputAlert.present();
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
