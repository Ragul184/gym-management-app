import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';

import { User } from '../../model/user';
import { UserService } from '../../services/user/user.service';

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
  searchTerm :string;
  

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService,
    private loadingController: LoadingController, private alertController: AlertController) {

    this.status = this.route.snapshot.paramMap.get('status');

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

  editMember(id: string) {
    console.log(`From EditMember: ID: ${id}`);
    this.router.navigate(['edit-member', id.toLowerCase()]);
  }

  updatePayment(id: string) {
    console.log(`From UpdatePayment: ID: ${id}`);
    this.router.navigate(['update-payment', id.toLowerCase()]);
  }

  async deleteMember(user: User) {
    console.log(`From DeleteMember: ID: ${user.id}`);
    await this.showLoading();
    const inputAlert = await this.alertController.create({
      message: `Are you sure want to delete this member ${user.memberName} with id: ${user.memberId}?`,
      buttons: [{
        text: 'Delete', handler: async () => {
          await this.showLoading();
          // DELETE USER HERE!
          await this.userService.deleteUser(user.id);
          await this.retrieveUsers(this.status);
          await this.hideLoading();
          await this.handleError({ message: 'Member Succesfully Deleted!' });
        }
      }, { text: 'Cancel', role: 'cancel', }]
    });
    await this.hideLoading();
    await inputAlert.present();
  }

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

  async handleError(error): Promise<void> {
    const alert = await this.alertController.create({
      message: error.message,
      buttons: [{ text: 'Ok', role: 'cancel' }]
    });
    await alert.present();
  }
}
