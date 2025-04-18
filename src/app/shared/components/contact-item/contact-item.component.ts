import { Component, Input, OnInit } from '@angular/core';
import { FcmService } from 'src/app/core/services/fcm.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.scss'],
  standalone: false
})
export class ContactItemComponent  implements OnInit {

  @Input() contact: any;

  constructor(
    private fcmService: FcmService,
    private notificationService: NotificationService,
    private fbSvc: FirebaseService
  ) { }

  ngOnInit() {
    console.log(this.contact)
  }

  async call(){

    const uid = await this.fbSvc.getCurrentUid();

    if(uid){
      const fcmToken = this.fcmService.getToken(); 
      const userId = this.contact.userId;
      const meetingId = '(no jitsi meeting id yet)';
      const contactName = this.contact.name;
      const userFrom = uid;

      if (fcmToken) {
        this.notificationService
          .sendNotification(fcmToken, userId, meetingId, contactName, userFrom)
          .subscribe({
            next: (response) => {
              console.log('Notificación enviada con éxito:', response);
            },
            error: (err) => {
              console.error('Error al enviar la notificación:', err);
            },
          });
      }
    }
    
  }


}

