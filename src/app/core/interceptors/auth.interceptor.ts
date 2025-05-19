import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { getAuth } from '@angular/fire/auth';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private notify: NotificationService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const defaultToken = localStorage.getItem('access_token');
    let ravishingToken = localStorage.getItem('ravishing_token');
    const url = req.url;

    const isExternal = url.includes('https://ravishing-courtesy-production.up.railway.app/notifications');

    if(isExternal){
        this.notify.setToken();
        
        ravishingToken = localStorage.getItem('ravishing_token');
    }

    const tokenToUse = isExternal ? ravishingToken : defaultToken;

    if (tokenToUse) {
      console.log("token: ", tokenToUse);
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${tokenToUse}`
        }
      });

      if (!isExternal) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          user.getIdToken().then(newToken => {
            localStorage.setItem('access_token', newToken);
          });
        }
      }

      return next.handle(authReq);
    }

    return next.handle(req);
  }


}
