import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { combineLatest, from, map, Observable, of, switchMap } from 'rxjs';
import { Contact } from 'src/app/models/contact.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: Firestore) { }

  async getChatID(uid: string, cuid: string): Promise<String|null>{

    const exist1 = await this.checkIfDocExists(this.firestore, 'chats', `${uid}-${cuid}`);

    if(exist1){
      return `${uid}-${cuid}`;
    }else{
      const exist2 = await this.checkIfDocExists(this.firestore, 'chats', `${cuid}-${uid}`);
      if(exist2){
        return `${cuid}-${uid}`;
      }else{
        this.createChatRoom(uid,cuid).then(()=>{
          return `${uid}-${cuid}`;
        }).catch((error)=>{
          console.log(error);
        });
      }
    }
    
    return null;
  }

  createChatRoom(uid: string, cuid: string){
    const chatref = doc(this.firestore, `chats/${uid}-${cuid}`);
    return setDoc(chatref,{
      lastMsj: "",
      whiteList: [uid, cuid]
    })

  }

  async checkIfDocExists(firestore: Firestore, collectionPath: string, docId: string): Promise<boolean> {
    const docRef = doc(firestore, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists(); // ✅ true si existe, false si no
  }


}
