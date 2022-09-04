import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { UserPaymentInfo } from 'src/app/model/userPaymentInfo';
import { CollectionsService } from 'src/app/services/collections/collections.service';

@Component({
  selector: 'app-view-all-payments',
  templateUrl: './view-all-payments.page.html',
  styleUrls: ['./view-all-payments.page.scss'],
})
export class ViewAllPaymentsPage implements OnInit {
  public loading: HTMLIonLoadingElement;
  payments = [];
  currentPage = 1;
  mode = 0;
  filter = 'all';
  usersPaymentInfo: UserPaymentInfo[] = [];

  name = '';
  src = 'todayCollection';
  background = 'rgba(255, 196, 9, 0.1)';
  page = '/view-all-payments/today';
  totalAmount = 0;

  constructor(private collectionService: CollectionsService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router) {
    this.filter = this.route.snapshot.paramMap.get('filter');
    this.mode = this.filter === 'today' ? 1 : 0;
    this.name = this.mode === 0 ? 'Total Collection' : 'Today Collection';
    this.retrievePayments(this.filter);
  }

  ngOnInit() { }

  async doRefresh(event) {
    console.log('Refresh Started');

    this.name = this.mode === 0 ? 'Total Collection' : 'Today Collection';

    if (this.mode === 0) { // FOR TOTAL
      await this.retrievePayments('all');
    }

    if (this.mode === 1) { // FOR TODAY
      await this.retrievePayments('today');
    }

    await event.target.complete();
    console.log('Async operation has ended');
  }

  async retrievePayments(timeline?: string) {
    try {
      await this.showLoading();

      return this.collectionService.getAllUserPayments(timeline).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(async data => {
        this.usersPaymentInfo = data;
        this.populateTotalAmount();
        await this.hideLoading();
      });


    } catch (error) {
      console.error(error);
      this.handleError(error);
      await this.hideLoading();
    }
  }

  populateTotalAmount() {
    this.totalAmount = this.usersPaymentInfo.filter(({ feesPaid }) => feesPaid === 'yes').reduce((acc, curr) => acc + curr.amount, 0);
  }

  switchTab(event: any) {
    console.log(this.mode, ' = ', event.target.value);

    this.mode = event.target.value * 1;
    this.name = this.mode === 0 ? 'Total Collection' : 'Today Collection';
    console.log(this.mode === 0);
    console.log(this.mode === 1);

    if (this.mode === 0) { // FOR TOTAL
      this.retrievePayments('all');
    }

    if (this.mode === 1) { // FOR TODAY
      this.retrievePayments('today');
    }
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
