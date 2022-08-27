import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/compat/firestore';
import { collection, getDocs, getFirestore, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserPaymentInfo } from 'src/app/model/userPaymentInfo';
import { AuthService } from '../auth.service';
import { UserService } from '../user/user.service';
import { User as UserAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  public loading: HTMLIonLoadingElement;
  userPaymentsRef: AngularFirestoreCollection<UserPaymentInfo>;
  userPaymentsDoc: AngularFirestoreDocument<UserPaymentInfo>;
  firestore = getFirestore();
  userAuth: UserAuth;
  private dbPath = '/payments';

  constructor(private db: AngularFirestore, private authService: AuthService, private userService: UserService,
    private loadingController: LoadingController, private router: Router,
    private alertController: AlertController) {
    this.userAuth = authService.getCurrentUser();
    this.userPaymentsRef = db.collection(this.dbPath, ref => ref.where('gymName', '==', this.userAuth.uid));
  }

  getPaymentWithId(paymentId: string): AngularFirestoreDocument<UserPaymentInfo> {
    return this.userPaymentsRef.doc(paymentId);
  }

  getAllUserPayments(timeline?: string): AngularFirestoreCollection<UserPaymentInfo> {
    if (timeline === 'today') {
      const today = new Date(); today.setHours(0, 0, 0);
      return this.db.collection(this.dbPath, ref => ref.where('gymName', '==', this.userAuth.uid)
        .where('paymentDateTime', '>=', today).orderBy('paymentDateTime', 'desc'));
    }
    return this.userPaymentsRef;
  }

  async getLatestPaymentById(id: string) {
    const paymentQuery = query(
      collection(this.firestore, this.dbPath),
      where('gymName', '==', this.userAuth.uid),
      where('memberId', 'in', [id.toLowerCase(), id.toUpperCase()]),
      orderBy('paymentDateTime', 'desc'),
      limit(1)
    );
    return await getDocs(paymentQuery);
  }

  saveUserPayment(userPaymentInfo: UserPaymentInfo): Promise<DocumentReference<UserPaymentInfo>> {
    return this.userPaymentsRef.add({ ...userPaymentInfo });
  }

  updateUserPayment(id: string, userPaymentInfo: UserPaymentInfo): Promise<void> {
    return this.userPaymentsRef.doc(id).update(userPaymentInfo);
  }

  async deleteUserPayment(payDocId: string): Promise<void> {
    try {
      await this.showLoading();

      let subscriptionEndDt = '';
      let feesPaid = '';
      let userDocumentID = '';

      const paymentRef = await this.getPaymentWithId(payDocId).get().toPromise();
      const paymentData = { id: paymentRef.id, ...paymentRef.data() };
      await this.userPaymentsRef.doc(payDocId).delete();

      // Get Second Latest Payment Detail after deleting the latest payment detail
      const latestPaymentRef = await this.getLatestPaymentById(paymentData.memberId);
      latestPaymentRef.forEach(item => {
        subscriptionEndDt = item.data().subscriptionEndDt;
        feesPaid = item.data().feesPaid;
      });

      // Getting the USER ID of corresponding user with Member ID
      const userDocRef = await this.userService.getUserByMemberId(paymentData.memberId).get().toPromise();
      userDocRef.forEach(item => userDocumentID = item.id);

      // Update the subscription end date and fees paid status in User Document also
      const data = { feesPaid, subscriptionEndDt };
      await this.userService.updateUser(userDocumentID, data).then(() => {
        console.log('Updated the member successfully!', data);
      });


      await this.hideLoading();
      return null;

    } catch (error) {
      console.error(error);
      this.handleError(error);
      this.router.navigate(['/home']);
      await this.hideLoading();
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
