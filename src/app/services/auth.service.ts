import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable, from, pipe } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private http: HttpClient, private auth: Auth, private firestore: Firestore) {
    this.loadToken();
    // this.summaRead();
  }

  async summaRead() {
    const demoRef = collection(this.firestore, 'demo');
    const record = await addDoc(demoRef, { name: 'Hello How are you' });
    console.log('Record Written: ', record.id);
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
  async register({ email, password }) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return null;
    }
  }

  async signin({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      this.http.post(`https://reqres.in/api/login`, { email, password }).pipe(
        map((data: any) => data.token),
        switchMap(token => from(Preferences.set({ key: TOKEN_KEY, value: token }))
        ),
        tap(_ => {
          this.isAuthenticated.next(true);
        })
      );
      return user;
    } catch (e) {
      return null;
    }
  }

  async signout() {
    return signOut(this.auth);
  }
}
