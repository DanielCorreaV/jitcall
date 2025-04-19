import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

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

  async getToken(): Promise<string | null> {
    const body = { 
      email: 'daniel.correavega@unicolombo.edu.co',
      password: 'daniel3d'
    };
  
    try {
      const res = await firstValueFrom(
        this.http.post<any>('https://ravishing-courtesy-production.up.railway.app/user/login', body)
      );
  
      const token = res?.data?.access_token;
      if (token) {
        localStorage.setItem('ravishing_token', token);
        return token;
      }
  
      return null;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  }




}
