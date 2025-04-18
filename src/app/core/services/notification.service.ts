import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
