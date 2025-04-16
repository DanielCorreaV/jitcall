import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, deleteDoc, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Contact } from 'src/app/models/contact.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore, private auth: Auth) {}

  addUser(user: any, uid: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, {
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      image: user.image || ''
    });
  }

  editUser(user: any, uid: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, {
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      image: user.image || ''
    });
  }

  deleteUser(uid: string): Promise<any> {
    const userRef = doc(this.firestore, `users/${uid}/contacts`);
    return deleteDoc(userRef);
  }


  getUserData(uid: string){
    const userRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userRef);
  }

  deleteContact(cid: String, uid: string): Promise<void> {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${cid}`);
    return deleteDoc(contactRef);
  }

  addContact(contact: Contact, uid: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}/contacts`);
    return setDoc(userRef, {
      name: contact.name,
      phone: contact.phone,
      image: contact.image || ''
    });
  }

  editContact(cid: String, contact: Contact, uid: string): Promise<void> {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${cid}`);
    return updateDoc(contactRef, {
      name: contact.name,
      phone: contact.phone,
      image: contact.image || ''
    });
  }
  

}

