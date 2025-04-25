import { Component, OnInit } from '@angular/core';
import { FcmService } from './core/services/fcm.service';
import { NavController } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit{
  constructor(
    private fcm: FcmService,
    private navCtrl: NavController
  ) {
    this.fcm.onNotificationReceived().subscribe(notification => {
      if (notification && notification.data?.type === 'incoming_call') {
        console.log('Notificación de llamada entrante:', notification);

        const meetingId = notification.data.meetingId;
        const name = notification.data.name || 'Llamada entrante';

        this.navCtrl.navigateForward('/call', {
          queryParams: {
            meetingId,
            name
          }
        });
      }
    });
  }
  ngOnInit(): void {
    StatusBar.hide();
  }
}
