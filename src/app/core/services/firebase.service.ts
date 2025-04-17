import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, User as FirebaseUser, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { User } from 'src/app/models/user.model';
import { UserService } from './user.service';
import { Contact } from 'src/app/models/contact.model';
import { doc, docData, DocumentSnapshot, Firestore } from '@angular/fire/firestore';
import { DocumentData } from 'firebase/firestore/lite';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private auth: Auth, private usr: UserService,private firestore: Firestore) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
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

  register(user: User): Promise<void> {

    let isAllowed: boolean = false;
    this.usr.isPhoneRegistered(user.phone).then(res=>{
      isAllowed=!res;
    })

    if(isAllowed){
      return createUserWithEmailAndPassword(this.auth, user.email, user.password)
      .then(cred => {
        const uid = cred.user.uid;
        console.log('[Auth] Usuario registrado con UID:', uid);
  
        // Guarda el resto de datos en Firestore
        return this.usr.addUser(user, uid);
      })
      .catch(error => {
        console.error('[Auth] Error al registrar usuario:', error);
        throw error;
      });
    }else{
      throw new Error('El numero de telefono ya esta registrado');
    }
    }

    

  
  
}



