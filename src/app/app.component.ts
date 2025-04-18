import { Component } from '@angular/core';
import { FcmService } from './core/services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private fcm: FcmService) {
    this.fcm.onNotificationReceived().subscribe(notification => {
      if (notification) {
        console.log('Notificación en foreground:', notification);
        // podrías mostrar un modal, toast, etc.
      }
    });
  }
}
