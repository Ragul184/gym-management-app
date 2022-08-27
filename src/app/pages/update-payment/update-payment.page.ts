import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserPaymentInfo } from 'src/app/model/userPaymentInfo';
import { CollectionsService } from 'src/app/services/collections/collections.service';
import { UserService } from 'src/app/services/user/user.service';
import { DEFAULT_FEE_AMOUNT } from '../add-member/add-member.page';
import { User as UserAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-update-payment',
  templateUrl: './update-payment.page.html',
  styleUrls: ['./update-payment.page.scss'],
})
export class UpdatePaymentPage implements OnInit {
  public loading: HTMLIonLoadingElement;
  updateFeeForm: FormGroup;
  id: string;
  docId: string;
  paymentData: UserPaymentInfo[] = [];

  submitted: boolean;
  userPaymentInfo: UserPaymentInfo;
  userAuth: UserAuth;

  constructor(private route: ActivatedRoute, private userService: UserService, private fb: FormBuilder,
    private alertController: AlertController, private router: Router, private authService: AuthService,
    private loadingController: LoadingController, private collectionService: CollectionsService) {
    this.userAuth = authService.getCurrentUser();
    this.id = this.route.snapshot.paramMap.get('id').toLowerCase();
    this.getLatestPaymentDetails(this.id);
  }

  get memberId() { return this.updateFeeForm.get('memberId'); }
  get memberName() { return this.updateFeeForm.get('memberName'); }
  get joiningDt() { return this.updateFeeForm.get('joiningDt'); }
  get feesPaid() { return this.updateFeeForm.get('feesPaid'); }
  get amount() { return this.updateFeeForm.get('amount'); }
  get subscriptionStartDt() { return this.updateFeeForm.get('subscriptionStartDt'); }
  get subscriptionEndDt() { return this.updateFeeForm.get('subscriptionEndDt'); }
  get numOfMonths() { return this.updateFeeForm.get('numOfMonths'); }

  ngOnInit() {
    this.updateFeeForm = this.fb.group({
      memberId: ['', [Validators.required, Validators.maxLength(6)]],
      memberName: ['', [Validators.required, Validators.maxLength(25)]],
      joiningDt: ['', [Validators.required]],
      feesPaid: ['', [Validators.required]],
      amount: ['', [Validators.min(DEFAULT_FEE_AMOUNT)]],
      subscriptionStartDt: ['', []],
      subscriptionEndDt: ['', []],
      numOfMonths: ['', []],
    }, { validators: [this.isCorrectAmount('amount')] } as AbstractControlOptions);
    // setInterval(() => {
    //   console.log(this.updateFeeForm.dirty && this.updateFeeForm.touched && !this.updateFeeForm.pristine);
    // }, 5000);
  }

  async getLatestPaymentDetails(id: string) {
    const latestPayment = await this.collectionService.getLatestPaymentById(id);
    latestPayment.forEach(item => this.paymentData.push(item.data() as UserPaymentInfo));

    const docIdList = await this.userService.getDocIdByUserId(this.paymentData[0].memberId);
    docIdList.forEach(item => this.docId = item.id);

    console.log(this.paymentData);
    this.memberId.setValue(this.paymentData[0].memberId);
    this.memberName.setValue(this.paymentData[0].memberName);
    this.joiningDt.setValue(this.formatDate(this.paymentData[0].joiningDt.toDate()));
    this.feesPaid.setValue(this.paymentData[0].feesPaid);
    if (this.feesPaid.value === 'yes') {
      this.amount.setValue(this.paymentData[0].amount);
      this.subscriptionStartDt.setValue(this.paymentData[0].subscriptionStartDt);
      this.subscriptionEndDt.setValue(this.paymentData[0].subscriptionEndDt);
      this.numOfMonths.setValue(this.paymentData[0].numOfMonths);
    }
  }

  async collectFormDetails() {
    this.submitted = false;
    this.userPaymentInfo = new UserPaymentInfo();

    if (this.feesPaid.value === 'yes') {
      this.userPaymentInfo = {
        memberId: this.updateFeeForm.get('memberId').value,
        memberName: this.updateFeeForm.get('memberName').value,
        gymName: this.userAuth.uid,
        joiningDt: new Date(this.updateFeeForm.get('joiningDt').value),
        feesPaid: this.updateFeeForm.get('feesPaid').value,
        amount: this.updateFeeForm.get('amount').value,
        subscriptionStartDt: this.updateFeeForm.get('subscriptionStartDt').value,
        subscriptionEndDt: this.updateFeeForm.get('subscriptionEndDt').value,
        numOfMonths: this.updateFeeForm.get('numOfMonths').value,
        paymentDateTime: this.feesPaid.value === 'yes' ? new Date() : null
      };
    }
    else {
      this.userPaymentInfo = {
        memberId: this.updateFeeForm.get('memberId').value,
        memberName: this.updateFeeForm.get('memberName').value,
        gymName: this.userAuth.uid,
        joiningDt: new Date(this.updateFeeForm.get('joiningDt').value),
        feesPaid: this.updateFeeForm.get('feesPaid').value,
        paymentDateTime: this.feesPaid.value === 'yes' ? new Date() : null
      };
    }

    if (!(this.updateFeeForm.dirty && this.updateFeeForm.touched && !this.updateFeeForm.pristine)) {
      await this.showLoading();
      const confirmAlert = await this.alertController.create({
        header: 'No Change!',
        subHeader: `Values are not changed. Still are you sure want to update fee for this member ${this.userPaymentInfo.memberName}  \
                with id: ${this.userPaymentInfo.memberId}?`,
        message: 'This will create a new payment log in the collections which may be a duplicate!',
        buttons: [{
          text: 'Update', handler: async () => {
            // await this.showLoading();
            // DELETE PAYMENT HERE!
            await this.updatePayment();
            await this.router.navigate(['home']);
            // await this.hideLoading();
            // await this.handleError({ message: 'Payment Detail Succesfully Added!' });
          }
        }, { text: 'Cancel', role: 'cancel', }]
      });
      await this.hideLoading();
      await confirmAlert.present();

    } else {

      await this.showLoading();
      const confirmAlert = await this.alertController.create({
        header: 'Confirm!',
        message: `Are you sure want to update fee for this member ${this.userPaymentInfo.memberName}  \
                  with id: ${this.userPaymentInfo.memberId}?`,
        buttons: [{
          text: 'Update', handler: async () => {
            // await this.showLoading();
            // DELETE PAYMENT HERE!
            await this.updatePayment();
            await this.router.navigate(['home']);
            // await this.hideLoading();
            // await this.handleError({ message: 'Payment Detail Succesfully Added!' });
          }
        }, { text: 'Cancel', role: 'cancel', }]
      });
      await this.hideLoading();
      await confirmAlert.present();
    }

  }

  async updatePayment() {
    try {

      await this.showLoading();

      const paymentTransDetails = await this.collectionService.saveUserPayment(this.userPaymentInfo);
      console.log('Added fee info successfully!', this.userPaymentInfo, paymentTransDetails.id);

      const data = {
        feesPaid: this.feesPaid.value,
        subscriptionEndDt: this.subscriptionEndDt.value
      };

      await this.userService.updateUser(this.docId, data).then(() => {
        console.log('Updated the member successfully!', data);
      });

      this.submitted = true;

      const alert = await this.alertController.create({
        header: 'Success',
        subHeader: 'Payment Added',
        message: `The new payment info has been updated for the Member ID: ${this.userPaymentInfo.memberId}!`,
        buttons: [{
          text: 'OK', handler: () => {
            this.router.navigate(['/payment-detail', paymentTransDetails.id], { replaceUrl: true });
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
    if (event.target.value === 'yes') {
      this.amount.setValue(DEFAULT_FEE_AMOUNT);
      this.calculateFee();
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

  // checkValueChanged(): boolean {
  //   if (this.feesPaid.value === 'yes') {
  //     this.userPaymentInfo = {
  //       memberId: this.updateFeeForm.get('memberId').value,
  //       memberName: this.updateFeeForm.get('memberName').value,
  //       joiningDt: new Date(this.updateFeeForm.get('joiningDt').value),
  //       feesPaid: this.updateFeeForm.get('feesPaid').value,
  //       amount: this.updateFeeForm.get('amount').value,
  //       subscriptionStartDt: this.updateFeeForm.get('subscriptionStartDt').value,
  //       subscriptionEndDt: this.updateFeeForm.get('subscriptionEndDt').value,
  //       numOfMonths: this.updateFeeForm.get('numOfMonths').value,
  //       paymentDateTime: this.feesPaid.value === 'no' ? null :
  //         this.paymentData[0].paymentDateTime ? this.paymentData[0].paymentDateTime.toDate() : new Date()
  //     };
  //     this.paymentData[0].joiningDt = this.paymentData[0].joiningDt.toDate();
  //     this.paymentData[0].paymentDateTime = this.paymentData[0].paymentDateTime.toDate();
  //     console.log(this.paymentData[0], this.userPaymentInfo, Object.);
  //   }
  //   else {
  //     this.userPaymentInfo = {
  //       memberId: this.updateFeeForm.get('memberId').value,
  //       memberName: this.updateFeeForm.get('memberName').value,
  //       joiningDt: new Date(this.updateFeeForm.get('joiningDt').value),
  //       feesPaid: this.updateFeeForm.get('feesPaid').value,
  //       paymentDateTime: this.feesPaid.value === 'yes' ? new Date() : null
  //     };
  //     return true;
  //   }
  // }

  // UTILITY FUNCTIONS
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
