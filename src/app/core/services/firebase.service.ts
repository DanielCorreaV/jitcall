import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, User as FirebaseUser, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { User } from 'src/app/models/user.model';
import { UserService } from './user.service';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FcmService } from './fcm.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: Auth,
    private usr: UserService,
    private firestore: Firestore,
    private fcm: FcmService
    ) {}

    async login(email: string, password: string) {
      const res = await signInWithEmailAndPassword(this.auth, email, password);
    
      const token = await this.fcm.initPush(); 
      if (token) {
        await this.usr.setToken(res.user.uid, token);
      }
    
      return res;
    }
    
    

  logOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return signOut(this.auth);
  }

  getCurrentUser(): Promise<FirebaseUser | null> {
    return new Promise(resolve => {
      onAuthStateChanged(this.auth, resolve);
    });
  }

  getCurrentUserData(): Observable<any | null> {
    return new Observable(observer => {
      this.getCurrentUser().then(user => {
        if (user) {
          const uid = user.uid;
          const userRef = doc(this.firestore, `users/${uid}`);
          docData(userRef, { idField: 'id' }).subscribe(data => {
            observer.next(data);
          }, err => observer.error(err));
        } else {
          observer.next(null);
        }
      });
    });
  }
  
  async getCurrentUid(): Promise<string | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          resolve(user.uid);
        } else {
          resolve(null);
        }
      });
    });
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  async register(user: User): Promise<void> {
    try {
      const isRegistered = await this.usr.isPhoneRegistered(user.phone);
      
      if (isRegistered) {
        throw new Error('the phone number is already registered');
      }
  
      const cred = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
      const uid = cred.user.uid;
  
      await this.usr.addUser(user, uid);
    } catch (error) {
      console.error('Error when registering user:', error);
      throw error;
    }
  }
  

    

  
  
}



