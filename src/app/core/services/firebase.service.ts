import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, User as FirebaseUser, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { User } from 'src/app/models/user.model';
import { UserService } from './user.service';
import { Contact } from 'src/app/models/contact.model';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { DocumentData } from 'firebase/firestore/lite';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private auth: Auth, private usr: UserService) {}

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

  getCurrentUserData(): Promise<DocumentSnapshot<DocumentData, DocumentData> | null> {
     return this.getCurrentUser().then(user => {
      if (user) {
        const uid = user.uid;
        //console.log('[Auth] UID del usuario actual:', uid);
        return this.usr.getUserData(uid);
      }
      return null;
    });
  }
  

  getCurrentUid(): string {
    const user = this.auth.currentUser;
    if(user){
      return  user.uid;
    }
    return '';
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  register(user: User): Promise<void> {
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
  }
  
}



