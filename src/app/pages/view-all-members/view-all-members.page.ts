import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController, ModalController, MenuController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { DeleteUserPage } from '../delete-user/delete-user.page';

import { User } from '../../model/user';
import { UserService } from '../../services/user/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-all-members',
  templateUrl: './view-all-members.page.html',
  styleUrls: ['./view-all-members.page.scss'],
})
export class ViewAllMembersPage implements OnInit {
  users?: User[];
  public loading: HTMLIonLoadingElement;
  show = false;
  userName: string;
  userPass: string;
  status: string;
  currentUser?: User;
  currentIndex = -1;
  title = '';

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService,
    private modalController: ModalController, private loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private ngZone: NgZone, private menuController: MenuController, private httpClient: HttpClient) {

    this.status = this.route.snapshot.paramMap.get('status');

    this.ngZone.run(() => {
    });
  }

  ngOnInit() {
    this.retrieveUsers(this.status);
  }

  retrieveUsers(status?: string): void {
    this.userService.getAllUsers(status).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.users = data;
      console.log('u', this.users);
    });
  }

  ionViewWillEnter() {
    this.menuController.enable(true, 'first');
    this.menuController.enable(false, 'second');
  }

  editMember(id: string) {
    console.log(`From EditMember: ID: ${id}`);
  }

  updatePayment(id: string) {
    console.log(`From UpdatePayment: ID: ${id}`);
    this.router.navigate(['update-payment', id.toLowerCase()]);
  }

  deleteMember(id: string) {
    console.log(`From DeleteMember: ID: ${id}`);
  }

  async showLoading(): Promise<void> {
    try {
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();
    } catch (error) {
      this.handleError(error);
    }
  }

  hideLoading(): Promise<boolean> {
    return this.loading.dismiss();
  }

  async handleError(error): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: error.message,
      buttons: [{ text: 'Ok', role: 'cancel' }]
    });
    await alert.present();
  }
}
