import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { CollectionsService } from 'src/app/services/collections/collections.service';

@Component({
  selector: 'app-view-all-payments',
  templateUrl: './view-all-payments.page.html',
  styleUrls: ['./view-all-payments.page.scss'],
})
export class ViewAllPaymentsPage implements OnInit {
  payments = [];
  currentPage = 1;
  mode = 0;
  filter = 'all';
  constructor(private collectionService: CollectionsService,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router) {
    this.filter = this.route.snapshot.paramMap.get('filter');
    this.mode = this.filter === 'today' ? 1 : 0;
  }

  ngOnInit() {
    console.log('inside init');

    this.loadCollections();
  }

  async loadCollections(event?: InfiniteScrollCustomEvent) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();
    console.log(this.mode + 'inside main');
    this.collectionService.getPayments(this.currentPage, this.mode).subscribe(
      (res) => {
        loading.dismiss();
        console.log(res.results);
        this.payments.push(...res.results);

        event?.target.complete();
        if (event) {
          event.target.disabled = res.totalPages === this.currentPage;
        }
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }
  loadMore(event) {
    this.currentPage++;
    this.loadCollections(event);
  }
  switchTab(event: any) {
    console.log(this.mode + 'Tab changed', event.target.value);
    this.payments = [];
    this.currentPage = 1;
    this.mode = event.target.value;
    this.loadCollections();
  }

}
