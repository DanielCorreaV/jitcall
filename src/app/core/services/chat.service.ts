import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { combineLatest, from, map, Observable, of, switchMap } from 'rxjs';
import { message } from 'src/app/models/message.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: Firestore, private user: UserService) { }

  async getChatID(uid1: string, uid2: string): Promise<string | null> {
  const id1 = `${uid1}-${uid2}`;
  const id2 = `${uid2}-${uid1}`;

  const exist1 = await this.checkIfDocExists(this.firestore, 'chats', id1);
  if (exist1) {
    return id1;
  }

  const exist2 = await this.checkIfDocExists(this.firestore, 'chats', id2);
  if (exist2) {
    return id2;
  }

  try {
    await this.createChatRoom(uid1, uid2);
    const chatRoom = id1;
    await this.setChatRoom(chatRoom, uid1, uid2);
    await this.setChatRoom(chatRoom, uid2, uid1);
    return chatRoom;
  } catch (error) {
    console.error('Error creating chat room:', error);
    return null;
  }
}


  createChatRoom(uid: string, cuid: string) {
    const chatref = doc(this.firestore, `chats/${uid}-${cuid}`);
    return setDoc(chatref, {
      lastMsj: "",
      lastTime: Date.now(),
      whiteList: [uid, cuid]
    })

  }

  setChatRoom(chatID: string, uid: string, relatedUser: string) {
    const chatref = doc(this.firestore, `users/${uid}/chats/${chatID}`);
    return setDoc(chatref, {
      id: chatID,
      relatedUser: relatedUser,
    });
  }

getChatMessagesGrouped(cid: string): Observable<{ date: string, messages: any[] }[]> {
  const chatRef = collection(this.firestore, `chats/${cid}/messages`);
  return collectionData(chatRef, { idField: 'id' }).pipe(
    map(messages => {
      const sorted = messages.sort((a, b) => a['date'] - b['date']);

      return sorted.reduce((groups: any[], msg) => {
        const dateObj = new Date(msg['date']);
        const dateKey = this.formatDateLabel(dateObj);

        const existingGroup = groups.find(g => g.date === dateKey);
        if (existingGroup) {
          existingGroup.messages.push(msg);
        } else {
          groups.push({ date: dateKey, messages: [msg] });
        }

        return groups;
      }, []);
    })
  );
}

private formatDateLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  if (isSameDay(date, today)) return 'Hoy';
  if (isSameDay(date, yesterday)) return 'Ayer';

  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}



  async checkIfDocExists(firestore: Firestore, collectionPath: string, docId: string): Promise<boolean> {
    const docRef = doc(firestore, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  async sendMessage(chatID: string, message: message) {
    if (chatID) {
      const chatref = doc(this.firestore, `chats/${chatID}/messages/MSJ-${Date.now()}`);
      return setDoc(chatref, message).then(() => {
        this.updateLastMessage(chatID, message);
      });
    }
  }

  updateLastMessage(chatID: string, message: message) {
    const chatref = doc(this.firestore, `chats/${chatID}`);
    return updateDoc(chatref, {
      lastMsj: message.content,
      lastTime: message.date
    })
  }

  getChats(uid: string): Observable<any[]> {
    const userChatsRef = collection(this.firestore, `users/${uid}/chats`);
    const userChats$ = collectionData(userChatsRef, { idField: 'id' }) as Observable<any[]>;

    return userChats$.pipe(
      switchMap(userChats => {
        if (userChats.length === 0) return of([]);

        const enrichedChats$ = userChats.map(userChat => {
          const chatRef = doc(this.firestore, 'chats', userChat.id);
          const userData$ = this.user.getContactById(uid, userChat.relatedUser);

          const chatData$ = docData(chatRef).pipe(
            map(data => ({
              lastMessage: data?.['lastMsj'] ?? null,
              lastTime: data?.['lastTime'] ?? null
            }))
          );
          
          return combineLatest([chatData$, userData$]).pipe(
            map(([chatData, userData]) => ({
              chatData,
              userData,
              meta: userChat
            }))
          );
        });

        return combineLatest(enrichedChats$);
      })
    );
  }



}
