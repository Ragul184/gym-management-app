import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Gender } from 'src/app/model/gender';
import { User } from 'src/app/model/user';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { UserService } from 'src/app/services/user/user.service';
import { User as UserAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.page.html',
  styleUrls: ['./edit-member.page.scss'],
})
export class EditMemberPage implements OnInit {

  mId: string;
  retrievedUser: User;
  public loading: HTMLIonLoadingElement;
  editMemberForm: FormGroup;
  today: any;
  selectedDate: any;
  memberAge: any;
  user: User;
  users?: User[];
  submitted = false;
  isShow = false;
  userAuth: UserAuth;

  constructor(private userService: UserService, private fb: FormBuilder, private route: ActivatedRoute,
    private alertController: AlertController, private router: Router, private authService: AuthService,
    private loadingController: LoadingController, private collectionService: CollectionsService) {
    this.userAuth = authService.getCurrentUser();
    this.mId = this.route.snapshot.paramMap.get('memberId');
    this.getUser(this.mId);
    this.today = this.formatDate(new Date());
  }

  get memberId() { return this.editMemberForm.get('memberId'); }
  get memberName() { return this.editMemberForm.get('memberName'); }
  get phoneNumber() { return this.editMemberForm.get('phoneNumber'); }
  get gender() { return this.editMemberForm.get('gender'); }
  get birthDt() { return this.editMemberForm.get('birthDt'); }
  get age() { return this.editMemberForm.get('age'); }
  get address() { return this.editMemberForm.get('address'); }
  get joiningDt() { return this.editMemberForm.get('joiningDt'); }
  get feesPaid() { return this.editMemberForm.get('feesPaid'); }
  get subscriptionEndDt() { return this.editMemberForm.get('subscriptionEndDt'); }
  get active() { return this.editMemberForm.get('active'); }

  ngOnInit() {
    this.editMemberForm = this.fb.group({
      memberId: ['', [Validators.required, Validators.maxLength(6)]],
      memberName: ['', [Validators.required, Validators.maxLength(25)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      gender: ['', [Validators.required]],
      birthDt: ['', [Validators.required]],
      age: ['', [Validators.required]],
      address: ['', [Validators.required]],
      joiningDt: ['', [Validators.required]],
      feesPaid: ['', [Validators.required]],
      subscriptionEndDt: [, []],
      active: [true, [Validators.required]],
    });
  }

  async getUser(memberId: string) {
    try {
      await this.showLoading();
      const userRef = await this.userService.getUserByMemberId(memberId).get().toPromise();
      userRef.forEach(res => {
        this.retrievedUser = { id: res.id, ...res.data() };
      });
      this.setEditValue(this.retrievedUser);
      await this.hideLoading();

    } catch (error) {
      console.error(error);
      this.handleError(error);
      await this.hideLoading();
    }
  }

  async setEditValue(retrievedUser: User) {

    console.log('SET VALUE: ', retrievedUser);

    this.memberId.setValue(retrievedUser.memberId);
    this.memberName.setValue(retrievedUser.memberName);
    this.phoneNumber.setValue(retrievedUser.phoneNumber);
    this.gender.setValue(retrievedUser.gender.toLowerCase());
    this.birthDt.setValue(this.formatDate(retrievedUser.birthDt.toDate()));
    this.age.setValue(retrievedUser.age);
    this.address.setValue(retrievedUser.address);
    this.joiningDt.setValue(this.formatDate(retrievedUser.joiningDt.toDate()));
    this.feesPaid.setValue(retrievedUser.feesPaid);
    this.subscriptionEndDt.setValue(retrievedUser.subscriptionEndDt);

    this.isShow = true;

  }

  async newUser(): Promise<void> {
    this.submitted = false;
    this.user = new User();

    this.user = {
      memberId: this.editMemberForm.get('memberId').value,
      memberName: this.editMemberForm.get('memberName').value,
      phoneNumber: this.editMemberForm.get('phoneNumber').value,
      gender: this.editMemberForm.get('gender').value.trim() === 'male' ? Gender.male : Gender.female,
      gymName: this.userAuth.uid,
      birthDt: new Date(this.editMemberForm.get('birthDt').value),
      age: this.editMemberForm.get('age').value,
      address: this.editMemberForm.get('address').value,
      joiningDt: new Date(this.editMemberForm.get('joiningDt').value),
      subscriptionEndDt: this.editMemberForm.get('subscriptionEndDt').value,
      feesPaid: this.editMemberForm.get('feesPaid').value,
      active: this.editMemberForm.get('active').value,
    };

    await this.showLoading();
    const confirmAlert = await this.alertController.create({
      header: 'Confirm!',
      message: `Are you sure want to update profile details for this member ${this.user.memberName}  \
                  with id: ${this.user.memberId}?`,
      buttons: [{
        text: 'Update', handler: async () => {
          await this.saveUser();
        }
      }, { text: 'Cancel', role: 'cancel', }]
    });
    await this.hideLoading();
    await confirmAlert.present();
  }

  async saveUser() {
    try {
      await this.showLoading();

      await this.userService.updateUser(this.retrievedUser.id, this.user).then(() => {
        console.log('Created new member successfully!', this.user);
      });

      this.submitted = true;

      const alert = await this.alertController.create({
        header: 'Success',
        subHeader: 'Member Updated',
        message: `The member with Member ID: ${this.user.memberId} was successfully updated. You can view member in View All Members Page.`,
        buttons: [{
          text: 'OK', handler: () => {
            this.router.navigate(['/home']);
          }
        }]
      });
      await this.hideLoading();
      await alert.present();

    } catch (error) {
      console.error(error);
      this.handleError(error);
      await this.hideLoading();
    }
  }

  // UTILITY FUNCTIONS
  ageCalc() {
    if (this.selectedDate !== '') {
      const today: any = new Date().getFullYear();
      const selectedDate: any = new Date(this.birthDt.value).getFullYear();
      const age = today - selectedDate;
      this.age.setValue(age);
    }
    else {
      this.age.setValue('');
    }
  }

  formatDate(date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 101).toString().substring(1);
    const day = (date.getDate() + 100).toString().substring(1);
    return year + '-' + month + '-' + day;
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
