import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { combineLatest, from, map, Observable, of, switchMap } from 'rxjs';
import { Contact } from 'src/app/models/contact.model';
import { SupabaseService } from './supabase.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore, private supabaseService: SupabaseService) {}

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

  async editUser(user: Contact, uid: string): Promise<void> {
    console.log(user, " ", uid);
    const userRef = doc(this.firestore, `users/${uid}`);
    
    if (user.image) {
      const imageUrl = await this.supabaseService.uploadAvatar(user.image, uid);
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }
      user.image = imageUrl;
    }
    console.log("user to update: "+ user);
    

    return updateDoc(userRef, {
      name: user.name,
      surname: user.surname,
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

  getUserByPhone(phone: string): Promise<any> {
    const q = query(collection(this.firestore, 'users'), where('phone', '==', phone));
    return getDocs(q).then(querySnapshot => {
      if (querySnapshot.empty) {
        throw new Error('The user does not exist.');
      }
      const userData = querySnapshot.docs[0].data();
      return {
        id: querySnapshot.docs[0].id,
        ...userData
      };
    });
  }

  getUserById(uid: string): Promise<any> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return getDoc(userRef).then(docSnap => {
      if (!docSnap.exists()) {
        throw new Error('The user does not exist.');
      }
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    });
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
    });
  }
  
getContacts(uid: string): Observable<any[]> {
  const contactsRef = collection(this.firestore, `users/${uid}/contacts`);
  const contacts$ = collectionData(contactsRef, { idField: 'id' }) as Observable<any[]>;

  return contacts$.pipe(
    switchMap((contacts: any[]) => {
      if (contacts.length === 0) return of([]);

      const enhancedContacts$ = contacts.map(contact => {
        const q = query(collection(this.firestore, 'users'), where('phone', '==', contact.phone));
        return from(getDocs(q)).pipe(
          map(snapshot => {
            const userDoc = snapshot.docs[0];
            const userData = userDoc ? userDoc.data() : null;

            return {
              ...contact,
              image: userData?.['image'] || null 
            };
          })
        );
      });

      return combineLatest(enhancedContacts$);
    })
  );
}

  

  getContactById(uid: string, cid: string): Promise<Contact> {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${cid}`);

    return getDoc(contactRef).then(async docSnap => {
      if (!docSnap.exists()) {
        throw new Error('The user does not exist.');
      }

      const userAsociated = await this.getUserByPhone(docSnap.data()['phone']);

      return {
        id: docSnap.id,
        image: userAsociated.image,
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

