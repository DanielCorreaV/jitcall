import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { Contact } from 'src/app/models/contact.model';


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

  editUser(user: Contact, uid: string): Promise<void> {
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
    const contactsRef = collection(this.firestore, `users/${uid}/contacts`);
    return addDoc(contactsRef, {
      name: contact.name,
      surname: contact.surname,
      phone: contact.phone,
      image: contact.image || ''
    }).then(() => {});
  }

  editContact(cid: String, contact: Contact, uid: string): Promise<void> {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${cid}`);
    return updateDoc(contactRef, {
      name: contact.name,
      phone: contact.phone,
      image: contact.image || ''
    });
  }
  
  getContacts(uid: string): Promise<any[]> {
    const contactsRef = collection(this.firestore, `users/${uid}/contacts`);
    return getDocs(contactsRef).then(snapshot => {
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  }
  

}

