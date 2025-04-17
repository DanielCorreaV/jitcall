import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  private fcmToken: string | null = null;

  private notificationReceived$ = new BehaviorSubject<PushNotificationSchema | null>(null);
  private notificationAction$ = new BehaviorSubject<ActionPerformed | null>(null);

  constructor(
    private platform: Platform,
    private toastCtrl: ToastController
  ) {
    if (this.platform.is('capacitor')) this.initPush();
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    await toast.present();
  }

  initPush() {
    console.log('Initializing Push Notifications');

    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        this.showToast('Push notification permission denied', 'danger');
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      this.fcmToken = token.value;
      this.showToast('Push registration success');
      console.log('FCM Token:', token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Registration error:', error);
      this.showToast('Push registration error', 'danger');
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      this.notificationReceived$.next(notification);
      console.log('Notification received:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      this.notificationAction$.next(notification);
      console.log('Notification action performed:', notification);
    });
  }

  getToken(): string | null {
    return this.fcmToken;
  }

  onNotificationReceived() {
    return this.notificationReceived$.asObservable();
  }

  onNotificationActionPerformed() {
    return this.notificationAction$.asObservable();
  }
}
