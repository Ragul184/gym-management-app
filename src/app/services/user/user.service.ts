import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentData } from '@angular/fire/compat/firestore';
import { collection, getDocs, getFirestore, limit, orderBy, query, QuerySnapshot, where } from '@angular/fire/firestore';
import { User } from '../../model/user';
import { AuthService } from '../auth.service';
import { User as UserAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersRef: AngularFirestoreCollection<User>;
  firestore = getFirestore();
  user: UserAuth;
  private dbPath = '/users';

  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.user = authService.getCurrentUser();
    this.usersRef = db.collection(this.dbPath, ref => ref.where('gymName', '==', this.user.uid));
  }

  getAllUsers(status?: string): AngularFirestoreCollection<User> {
    if (status === 'active') {
      return this.db.collection(this.dbPath, ref => ref.where('gymName', '==', this.user.uid)
        .where('subscriptionEndDt', '>=', this.formatDate(new Date())));
    }
    else if (status === 'expired') {
      return this.db.collection(this.dbPath, ref => ref.where('gymName', '==', this.user.uid)
        .where('subscriptionEndDt', '<', this.formatDate(new Date())));
    }
    return this.usersRef;
  }

  getUserByMemberId(memberId: string): AngularFirestoreCollection<User> {
    return this.db.collection(this.dbPath, ref => ref.where('gymName', '==', this.user.uid)
      .where('memberId', 'in', [memberId.toLowerCase(), memberId.toUpperCase()]));
  }

  async getDocIdByUserId(id: string): Promise<QuerySnapshot<DocumentData>> {
    const docIdQuery = query(
      collection(this.firestore, this.dbPath),
      where('gymName', '==', this.user.uid),
      where('memberId', 'in', [id.toLowerCase(), id.toUpperCase()]),
      limit(1)
    );
    return await getDocs(docIdQuery);
  }

  createUser(user: User): any {
    return this.usersRef.add({ ...user });
  }

  updateUser(id: string, data: any): Promise<void> {
    return this.usersRef.doc(id).update(data);
  }

  async deleteUser(id: string): Promise<void> {
    const deletedUserRef = this.db.collection('/deletedUsers');
    const userDoc = await this.db.collection(this.dbPath).doc(id).get().toPromise();
    const deleteData = userDoc.data();
    await deletedUserRef.doc(id).set(deleteData).then(result => {
      console.log(result);
    });
    return this.usersRef.doc(id).delete();
  }

  formatDate(date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 101).toString().substring(1);
    const day = (date.getDate() + 100).toString().substring(1);
    return year + '-' + month + '-' + day;
  }

  // constructor(private authService: AuthService) { }

  // updatePassword(email: string, password: string) {
  //   this.userCollectionRef = firebase.firestore().collection(`userProfile`);
  //   this.userCollectionRef.where('email', '==', email).get().then(snapshot => {
  //     snapshot.forEach(snap => {
  //       this.userListRef = firebase.firestore().collection('userProfile').doc(snap.id);
  //       this.userListRef.update({ password: password });
  //     })
  //   });
  // }
  // addUser(user:any){
  //   const usersRef = this.db.collection('users');
  //   usersRef.add({ ...user });

  // }

  // updateUser(user:any){
  //   const usersRef = this.db.collection('users');
  //   usersRef.doc(user.id).set({ ...user });
  // }

  // getUserDetails() {
  //   users: Observable<any[]>;
  //   users = this.db.collection('users').valueChanges();

  // }

  // getUserswithCategoryA() {
  //   this.userCollectionRef = firebase.firestore().collection('userProfile');
  //   return this.userCollectionRef.where('category', '==', 'A').get();
  // }

  // getUserswithCategoryB() {
  //   this.userCollectionRef = firebase.firestore().collection('userProfile');
  //   return this.userCollectionRef.where('category', '==', 'B').get();
  // }

  // getUserWithID(eid: string) {
  //   this.userCollectionRef = firebase.firestore().collection(`userProfile`);
  //   return this.userCollectionRef.where('eid', '==', eid).get();
  // }

  // getUserWithEmail(email: string) {
  //   this.userCollectionRef = firebase.firestore().collection(`userProfile`);
  //   return this.userCollectionRef.where('email', '==', email).get();
  // }

  // async getCurrentUser() {
  //   const user: firebase.User = await this.authService.getUser();
  //   this.userListRef.collection('userProfile').doc(user.uid);
  //   return this.userListRef.get();
  // }

}
