import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
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

  getAllUserPayments(): AngularFirestoreCollection<UserPaymentInfo> {
    return this.userPaymentsRef;
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


}
