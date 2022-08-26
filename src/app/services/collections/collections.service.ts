import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { collection, getDocs, getFirestore, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserPaymentInfo } from 'src/app/model/userPaymentInfo';

export interface ApiResult {
  page: number;
  results: any[];
  totalPages: number;
  totalResults: number;
}

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  userPaymentsRef: AngularFirestoreCollection<UserPaymentInfo>;
  userPaymentsDoc: AngularFirestoreDocument<UserPaymentInfo>;
  firestore = getFirestore();
  private dbPath = '/payments';

  constructor(private db: AngularFirestore, private httpClient: HttpClient) {
    this.userPaymentsRef = db.collection(this.dbPath);
  }

  getPayments(page = 1, mode = 0): Observable<ApiResult> {
    return this.getJSON(page, mode);
  }

  public getJSON(page: number, mode: number): Observable<ApiResult> {
    return this.httpClient.get<ApiResult>(`../assets/myData${mode}.json`);
  }

  getAllUserPayments(timeline?: string): AngularFirestoreCollection<UserPaymentInfo> {
    if (timeline === 'today') {
      const today = new Date(); today.setHours(0, 0, 0);
      return this.db.collection(this.dbPath, ref => ref.where('paymentDateTime', '>=', today));
    }
    return this.userPaymentsRef;
  }

  async getLatestPaymentById(id: string) {
    const paymentQuery = query(
      collection(this.firestore, this.dbPath),
      where('memberId', 'in', [id.toLowerCase(), id.toUpperCase()]),
      orderBy('paymentDateTime', 'desc'),
      limit(1)
    );
    return await getDocs(paymentQuery);
  }

  saveUserPayment(userPaymentInfo: UserPaymentInfo): any {
    return this.userPaymentsRef.add({ ...userPaymentInfo });
  }

  updateUserPayment(id: string, data: any): Promise<void> {
    return this.userPaymentsRef.doc(id).update(data);
  }

  deleteUserPayment(id: string): Promise<void> {
    return this.userPaymentsRef.doc(id).delete();
  }

  formatDate(date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 101).toString().substring(1);
    const day = (date.getDate() + 100).toString().substring(1);
    return year + '-' + month + '-' + day;
  }

}
