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

  async initPush(): Promise<string | null> {
    if (!this.platform.is('capacitor')) return null;
  
    const perm = await PushNotifications.requestPermissions();
    if (perm.receive !== 'granted') {
      await this.showToast('Permiso denegado para notificaciones push', 'danger');
      return null;
    }
  
    return new Promise((resolve, reject) => {
      PushNotifications.register();
  
      PushNotifications.addListener('registration', (token: Token) => {
        this.fcmToken = token.value;
        this.showToast('Push registration success');
        console.log('FCM Token:', token.value);
        resolve(token.value);
      });
  
      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Registration error:', error);
        this.showToast('Error en el registro de notificaciones', 'danger');
        reject(null);
      });
  
      // Escucha las notificaciones recibidas en foreground
      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        this.notificationReceived$.next(notification);
        console.log('Notification received:', notification);
      });
  
      // Escucha las acciones de las notificaciones
      PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
        this.notificationAction$.next(notification);
        console.log('Notification action performed:', notification);
      });
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
