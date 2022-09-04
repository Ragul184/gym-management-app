import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User
} from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  userInfo: User;

  constructor(private http: HttpClient, private auth: Auth, private firestore: Firestore) {
    // this.loadToken();
    console.log(this.getCurrentUser());
    // setDoc(
    //   doc(this.firestore, 'gymProfile', 'FnLZ7XSvDZgjp2qlH0diF1JMtqz2'),
    //   {
    //     gymAddress: 'Old No: 3, New No: 5,\n2nd Floor, Rama Iyer Street,\nVandavasi, Tiruvannamalai\nPIN: 604408'
    //   }, { merge: true }
    // ).then(res => {
    //   console.log('UPDATE RESULT: ', res);
    // });
    // onAuthStateChanged(this.auth, (user) => {
    //   if (user) {
    //     this.userInfo = user;
    //   } else {
    //     this.userInfo = null;
    //   }
    //   console.log(this.userInfo);
    // });
  }

  async loadToken() {
    const token = await Preferences.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { email: any; password: any }) {
    return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
      map((data: any) => data.token),
      switchMap(token => from(Preferences.set({ key: TOKEN_KEY, value: token }))
      ),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    );
  }

  logOut(): Promise<void> {
    this.isAuthenticated.next(false);
    return Preferences.remove({ key: TOKEN_KEY });
  }

  async register({ email, password, gymName, gymOwnerName, gymAddress, gymOwnerPhone }) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);

      const gymProfile = { email, password, gymName, gymOwnerName, gymAddress, gymOwnerPhone };
      const result = await setDoc(doc(this.firestore, 'gymProfile', user.user.uid), gymProfile);
      console.log('Document Successfully created: ', result);

      return user;
    } catch (e) {
      return null;
    }
  }

  async signin({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return null;
    }
  }

  async signout() {
    return signOut(this.auth);
  }

  getCurrentUser(): User {
    const userInfo = this.auth.currentUser;
    if (userInfo) {
      return userInfo;
    }
    return null;
  }

  async getCurrentUserProfile() {
    return await getDoc(doc(this.firestore, 'gymProfile', this.getCurrentUser().uid));
  }
}
