import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '../../model/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersRef: AngularFirestoreCollection<User>;
  private dbPath = '/users';

  constructor(private db: AngularFirestore) {
    this.usersRef = db.collection(this.dbPath);
  }

  getAllUsers(): AngularFirestoreCollection<User> {
    return this.usersRef;
  }

  createUser(user: User): any {
    return this.usersRef.add({ ...user });
  }

  updateUser(id: string, data: any): Promise<void> {
    return this.usersRef.doc(id).update(data);
  }

  deleteUser(id: string): Promise<void> {
    return this.usersRef.doc(id).delete();
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
