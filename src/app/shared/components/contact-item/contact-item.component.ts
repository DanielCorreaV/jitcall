import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CallService } from 'src/app/core/services/call.service';
import { FcmService } from 'src/app/core/services/fcm.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';
//import { JitsiPlugin } from 'jitsi-plugin/src';

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
    private fbSvc: FirebaseService,
    private jitsiCall: CallService,
    private usr: UserService
  ) { }

  ngOnInit() {
    console.log(this.contact);
  }

  async call() {
    const uid = await this.fbSvc.getCurrentUid();
  
    if (uid) {
      const fcmToken = await this.usr.getTokenByPhone(this.contact.phone);
      const userId = this.contact.id;
      const contactName = this.contact.name;
      const userFrom = uid;
  
      let room =''; //(await JitsiPlugin.createRoom()).meetingId;
  
      if (fcmToken && room) {
        this.notificationService
          .sendNotification(fcmToken, userId, room, contactName, userFrom)
          .subscribe({
            next: async (response) => {
              console.log('Notificación enviada con éxito:', response);
              try {
                // await JitsiPlugin.joinCall({
                //   meetingId: room,
                //   userName: contactName // o tu propio nombre si es quien inicia
                // });
                console.log('Unido a la sala:', room);
              } catch (error) {
                console.error('Error al unirse a la sala:', error);
              }
            },
            error: (err) => {
              console.error('Error al enviar la notificación:', err);
            },
          });
      } else {
        console.log("No hay token FCM o room");
      }
    }
  }
  

}

