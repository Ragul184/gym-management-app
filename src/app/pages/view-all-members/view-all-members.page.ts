import { Component, OnInit, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from 'src/app/services/user/user.service';
import { LoadingController, AlertController, ModalController, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DeleteUserPage } from '../delete-user/delete-user.page';
@Component({
  selector: 'app-view-all-members',
  templateUrl: './view-all-members.page.html',
  styleUrls: ['./view-all-members.page.scss'],
})
export class ViewAllMembersPage implements OnInit {
  users = [];
  public loading: HTMLIonLoadingElement;
  show: boolean = false;
  user_name: string;
  user_pass: string;

  constructor(private router: Router, private authService: AuthService, private userService: UserService,
    private modalController: ModalController,private loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private ngZone: NgZone, private menuController: MenuController) {
    this.ngZone.run(() => {
      this.fetchResults();
    })
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuController.enable(true, "first");
    this.menuController.enable(false, "second");
  }

  fetchResults() {
    // this.userService.getUserDetails().then(querysnapshot => {
    //   querysnapshot.forEach(snap => {
    //     this.users.push(snap.data());
    //   })
    // }).then(() => {
    //   this.users.sort((a, b) => {
    //     return a.eid.localeCompare(b.eid)
    //   });
    // }).then(() => {
    //   this.show = true;
    // })
  }

  // async deleteEmployee(id: string) {
  //   // console.log(id);
  //   this.userService.getUserWithID(id).then(snapshot => {
  //     snapshot.forEach(snap => {
  //       this.user_name = snap.data().eid,
  //         this.user_pass = snap.data().password
  //     });
  //   }).then(async () => {
  //     // console.log(this.user_name, this.user_pass);
  //     const inputAlert = await this.alertCtrl.create({
  //       message: `Are you sure want to delete this id: ${id} ?`,
  //       buttons: [{
  //         text: 'Delete', handler: async () => {
  //           const adminalert = await this.alertCtrl.create({
  //             header: 'Enter your(admin) username and password:',
  //             inputs: [{ name: 'adminuser', type: 'text', placeholder: 'Admin Username', value: 'admin' },
  //             { name: 'adminpass', type: 'text', placeholder: 'Admin Password', value: 'idadmin' }],
  //             buttons: [{
  //               text: 'Ok', handler: async data => {
  //                 this.showLoading();
  //                 const modal = await this.modalController.create({
  //                   component: DeleteUserPage,
  //                 });
  //                 await modal.present();
  //                 this.router.navigateByUrl('delete-employee');
  //                 this.authService.logout().then(() => {
  //                   this.authService.login(this.user_name, this.user_pass).then(() => {
  //                     this.authService.deleteUser().then(() => {
  //                       this.handleError({ message: 'User Succesfully Deleted!' });
  //                     }).catch(err => {
  //                       this.router.navigateByUrl('employee-list');
  //                       this.modalController.dismiss({ 'dismissed': true })
  //                       this.handleError(err);
  //                     }).then(() => {
  //                       this.authService.login(data.adminuser, data.adminpass).then(async () => {
  //                         this.router.navigateByUrl('/admin-home').then(() => {
  //                           this.modalController.dismiss({ 'dismissed': true });
  //                         })
  //                         await this.hideLoading();
  //                       });
  //                     });
  //                   });
  //                 });
  //               }
  //             }, { text: 'Cancel', role: 'cancel', }]
  //           });
  //           await adminalert.present();
  //         }
  //       }, { text: 'Cancel', role: 'cancel', }]
  //     });
  //     await inputAlert.present();
  //   })
  // }

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
