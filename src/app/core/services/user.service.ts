import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/models/contact.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  addUser(user: any, uid: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, {
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      image: user.image || '',
      token: ''
    });
  }

  editUser(user: Contact, uid: string): Promise<void> {
    console.log(user, " ", uid);
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

  getUsers(): Promise<any[]> {
    const usersRef = collection(this.firestore, `users`);
    return getDocs(usersRef).then(snapshot => {
      return snapshot.docs.map(doc => ({
        ...doc.data()
      }));
    });
  }

  getUserData(uid: string){
    const userRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userRef);
  }

  deleteContact(uid: string, cid: String): Promise<void> {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${cid}`);
    return deleteDoc(contactRef);
  }

  async addContact(contact: Contact, uid: string): Promise<void> {
    try {
      const isAllowed = await this.isPhoneRegistered(contact.phone);
      if (isAllowed) {
        const contactsRef = collection(this.firestore, `users/${uid}/contacts`);
        await addDoc(contactsRef, {
          name: contact.name,
          surname: contact.surname,
          phone: contact.phone,
          image: contact.image || ''
        });
      } else {
        throw new Error('The user does not exist.');
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      throw error;
    }
  }
  

  editContact(contact: Contact, uid: string, cid: String): Promise<void> {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${cid}`);
    return updateDoc(contactRef, {
      name: contact.name,
      surname: contact.surname,
      phone: contact.phone,
      image: contact.image || ''
    });
  }
  
  getContacts(uid: string): Observable<any[]> {
    const contactsRef = collection(this.firestore, `users/${uid}/contacts`);
    return collectionData(contactsRef, { idField: 'id' }) as Observable<any[]>;
  }
  

  getContactById(uid: string, cid: string): Promise<Contact> {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${cid}`);
    return getDoc(contactRef).then(docSnap => {
      if (!docSnap.exists()) {
        throw new Error('The user does not exist.');
      }
      return {
        id: docSnap.id,
        ...docSnap.data()
      }as Contact;
    });
  }

  async isPhoneRegistered(phone: string): Promise<boolean> {
    const users = await this.getUsers();
    return users.some(user => user.phone === phone);
  }

  async getTokenByPhone(phone: string): Promise<string | null> {
    const q = query(collection(this.firestore, 'users'), where('phone', '==', phone));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData['token'] || null;
    }
  
    return null;
  }

  setToken(uid: string, Utoken: string): Promise<void>{
    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, {
      token: Utoken
    });
  }
  
  
  
  

}

