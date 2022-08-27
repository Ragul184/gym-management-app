import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Gender } from 'src/app/model/gender';
import { UserPaymentInfo } from 'src/app/model/userPaymentInfo';
import { User } from '../../model/user';
import { UserService } from '../../services/user/user.service';
import { map } from 'rxjs/operators';
import { CollectionsService } from 'src/app/services/collections/collections.service';

export const DEFAULT_FEE_AMOUNT = 500;

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.page.html',
  styleUrls: ['./add-member.page.scss'],
})
export class AddMemberPage implements OnInit {
  public loading: HTMLIonLoadingElement;
  addMemberForm: FormGroup;
  today: any;
  selectedDate: any;
  memberAge: any;
  user: User;
  users?: User[];
  submitted = false;
  userPaymentInfo: UserPaymentInfo;
  maxId = '';
  currentId = '';

  constructor(private userService: UserService, private fb: FormBuilder,
    private alertController: AlertController, private router: Router,
    private loadingController: LoadingController, private collectionService: CollectionsService) {
    this.today = this.formatDate(new Date());
    this.retrieveId();
  }

  get memberId() { return this.addMemberForm.get('memberId'); }
  get memberName() { return this.addMemberForm.get('memberName'); }
  get phoneNumber() { return this.addMemberForm.get('phoneNumber'); }
  get gender() { return this.addMemberForm.get('gender'); }
  get birthDt() { return this.addMemberForm.get('birthDt'); }
  get age() { return this.addMemberForm.get('age'); }
  get address() { return this.addMemberForm.get('address'); }
  get joiningDt() { return this.addMemberForm.get('joiningDt'); }
  get feesPaid() { return this.addMemberForm.get('feesPaid'); }
  get amount() { return this.addMemberForm.get('amount'); }
  get subscriptionStartDt() { return this.addMemberForm.get('subscriptionStartDt'); }
  get subscriptionEndDt() { return this.addMemberForm.get('subscriptionEndDt'); }
  get numOfMonths() { return this.addMemberForm.get('numOfMonths'); }
  get active() { return this.addMemberForm.get('active'); }

  ngOnInit() {
    this.addMemberForm = this.fb.group({
      memberId: ['', [Validators.required, Validators.maxLength(6)]],
      memberName: ['', [Validators.required, Validators.maxLength(25)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      gender: ['', [Validators.required]],
      birthDt: ['', [Validators.required]],
      age: ['', [Validators.required]],
      address: ['', [Validators.required]],
      joiningDt: [this.today, [Validators.required]],
      feesPaid: ['', [Validators.required]],
      amount: ['500', [Validators.min(DEFAULT_FEE_AMOUNT)]],
      subscriptionStartDt: ['', []],
      subscriptionEndDt: ['', []],
      numOfMonths: ['', []],
      active: [true, [Validators.required]],
    }, { validators: [this.isCorrectAmount('amount')] } as AbstractControlOptions);
  }

  async newUser(): Promise<void> {
    this.submitted = false;
    this.user = new User();
    this.userPaymentInfo = new UserPaymentInfo();

    this.user = {
      memberId: this.addMemberForm.get('memberId').value,
      memberName: this.addMemberForm.get('memberName').value,
      phoneNumber: this.addMemberForm.get('phoneNumber').value,
      address: this.addMemberForm.get('address').value,
      gender: this.addMemberForm.get('gender').value.trim() === 'male' ? Gender.male : Gender.female,
      birthDt: new Date(this.addMemberForm.get('birthDt').value),
      age: this.addMemberForm.get('age').value,
      joiningDt: new Date(this.addMemberForm.get('joiningDt').value),
      subscriptionEndDt: this.addMemberForm.get('subscriptionEndDt').value,
      feesPaid: this.addMemberForm.get('feesPaid').value,
      active: this.addMemberForm.get('active').value,
    };

    if (this.feesPaid.value === 'yes') {
      this.userPaymentInfo = {
        memberId: this.addMemberForm.get('memberId').value,
        memberName: this.addMemberForm.get('memberName').value,
        joiningDt: new Date(this.addMemberForm.get('joiningDt').value),
        feesPaid: this.addMemberForm.get('feesPaid').value,
        amount: this.addMemberForm.get('amount').value,
        subscriptionStartDt: this.addMemberForm.get('subscriptionStartDt').value,
        subscriptionEndDt: this.addMemberForm.get('subscriptionEndDt').value,
        numOfMonths: this.addMemberForm.get('numOfMonths').value,
        paymentDateTime: this.feesPaid.value === 'yes' ? new Date() : null
      };
    } else {
      this.userPaymentInfo = {
        memberId: this.addMemberForm.get('memberId').value,
        memberName: this.addMemberForm.get('memberName').value,
        joiningDt: new Date(this.addMemberForm.get('joiningDt').value),
        feesPaid: this.addMemberForm.get('feesPaid').value,
        paymentDateTime: this.feesPaid.value === 'yes' ? new Date() : null
      };
    }

    await this.showLoading();
    const confirmAlert = await this.alertController.create({
      header: 'Confirm!',
      message: `Are you sure want to submit details for adding a member ${this.user.memberName}  \
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

      await this.userService.createUser(this.user).then(() => {
        console.log('Created new member successfully!', this.user);
      });

      await this.collectionService.saveUserPayment(this.userPaymentInfo).then(() => {
        console.log('Added fee info successfully!', this.user);
      });

      this.submitted = true;

      const alert = await this.alertController.create({
        header: 'Success',
        subHeader: 'Member Added',
        message: `The member with Member ID: ${this.user.memberId} was successfully created. You can view member in View All Members Page.`,
        buttons: [{
          text: 'OK', handler: () => {
            this.retrieveId();
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

  toggleFeePaidStatus(event) {
    console.log(this.addMemberForm.errors);
    if (event.target.value === 'yes') {
      this.amount.setValue(DEFAULT_FEE_AMOUNT);
      this.calculateFee();
    } else {
      this.resetValue();
    }
  }

  calculateFee() {
    const amount = this.amount.value;
    const subStartDt = this.subscriptionStartDt.value ? this.subscriptionStartDt.value : this.formatDate(new Date());
    const subEndDt = this.calculateEndDate(new Date(subStartDt), Math.floor(amount / DEFAULT_FEE_AMOUNT));
    const numOfMonths = this.numOfMonths.value;

    this.subscriptionStartDt.setValue(subStartDt);
    this.subscriptionEndDt.setValue(subEndDt);
    this.numOfMonths.setValue(this.monthDiff(new Date(subStartDt), new Date(subEndDt)));
  }

  calculateEndDate(subStartDt: Date, numOfMonths: number) {
    return this.formatDate(new Date(new Date().setMonth(subStartDt.getMonth() + numOfMonths, subStartDt.getDate())));
  }

  resetValue() {
    // this.amount.setValue(0);
    this.subscriptionStartDt.setValue('');
    this.subscriptionEndDt.setValue('');
    this.numOfMonths.setValue(0);
  }

  // UTILITY FUNCTIONS
  retrieveId() {
    this.userService.getAllUsers().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.users = data;
      const memberIdArray = this.users.map(member => member.memberId).sort((a, b) => b.localeCompare(a));

      this.maxId = memberIdArray[0] ? memberIdArray[0] : 'EX-000';
      this.currentId = (this.maxId.split('-')[0] + '-' + ((this.maxId.split('-')[1] as any * 1) + 1001).toString().substring(1));

      this.memberId.setValue(this.currentId);
      console.log('u', this.users);
    });
  }

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

  monthDiff(date1: Date, date2: Date) {
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth();
    months += date2.getMonth();
    return months <= 0 ? 0 : (months * 1);
  }

  // CUSTOM FEE AMOUNT VALIDATOR
  isCorrectAmount(controlName: string): ValidationErrors | null {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      if (control.errors) {
        return;
      }

      if ((control.value * 1) % (DEFAULT_FEE_AMOUNT * 1) !== 0) {
        return control.setErrors({ correctAmount: true });
      } else {
        return control.setErrors(null);
      }
    };
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
