import { Component, OnInit } from '@angular/core';
import { FcmService } from './core/services/fcm.service';
import { NavController, Platform } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private fcm: FcmService,
    private navCtrl: NavController,
    private platform: Platform
  ) {
    this.setupNotifications();
    this.initializeApp();
  }

  ngOnInit(): void {
    StatusBar.hide();
  }

  private setupNotifications() {
    this.fcm.onNotificationReceived().subscribe(notification => {
      if (notification?.data?.type === 'incoming_call') {
        const meetingId = notification.data.meetingId;
        const name = notification.data.name || 'Llamada entrante';

        this.navCtrl.navigateForward('/call', {
          queryParams: { meetingId, name }
        });
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      Keyboard.setAccessoryBarVisible({ isVisible: false });

      Keyboard.setScroll({ isDisabled: false });

      Keyboard.addListener('keyboardWillShow', () => {
        document.body.classList.add('keyboard-open');
      });

      Keyboard.addListener('keyboardWillHide', () => {
        document.body.classList.remove('keyboard-open');
      });
    });
  }
}
