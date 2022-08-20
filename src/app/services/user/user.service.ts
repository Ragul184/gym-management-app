import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // public userCollectionRef: firebase.firestore.CollectionReference;
  // public userListRef: firebase.firestore.DocumentReference;

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

  // getUserDetails() {
  //   this.userCollectionRef = firebase.firestore().collection('userProfile');
  //   return this.userCollectionRef.get();
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