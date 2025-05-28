import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient, private user: UserService) {}

  sendNotification(token: string, userId: string, meetingId: string, contactName: string, userFrom: string): Observable<any> {
    
    const payload = {
      token: token,
      notification: {
        title: 'Llamada entrante',
        body: `${contactName} te está llamando`,
      },
      android: {
        priority: 'high',
        data: {
          userId: userId,
          meetingId: meetingId,
          type: 'incoming_call',
          name: contactName,
          userFrom: userFrom,
        },
      },
    };

    console.log("payload: "+ payload);

    return this.http.post(
      'https://ravishing-courtesy-production.up.railway.app/notifications',
      payload,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  async setToken() {
    const body = { 
      email: 'daniel.correavega@unicolombo.edu.co', //colocar credenciales
      password: 'daniel3d'
    };
  
    try {
      const res = await firstValueFrom(
        this.http.post<any>('https://ravishing-courtesy-production.up.railway.app/user/login', body)
      );
  
      let token = res?.data?.access_token;
      if (token) {
        token = token.replace("Bearer ", "");
        localStorage.setItem('ravishing_token', token);
      }
  
    } catch (error) {
      console.error('Error al obtener el token:', error);
    }
  }

  async sendChatNotification(uid: string, cuid: string){
    const currentUser = await this.user.getUserById(uid);
    const contact = await this.user.getUserById(cuid);

    
    
    const payload = {
      token: contact.token,
      notification: {
        title: 'Llamada entrante',
        body: `${currentUser.name} te está llamando`,
      },
      android: {
        priority: 'high',
        data: {
          userId: currentUser.id,
          meetingId: "chat-room",
          type: 'new-message',
          name: contact.name,
          userFrom: currentUser.token,
        },
      },
    };

    console.log("payload: "+ payload);

    return this.http.post(
      'https://ravishing-courtesy-production.up.railway.app/notifications',
      payload,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }




}
