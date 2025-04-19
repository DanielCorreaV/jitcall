import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CallService } from 'src/app/core/services/call.service';
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
  @Output() callFrame = new EventEmitter<string>();
  callID = '';

  constructor(
    private fcmService: FcmService,
    private notificationService: NotificationService,
    private fbSvc: FirebaseService,
    private jitsiCall: CallService
  ) { }

  ngOnInit() {
  }

  async call(){

    const uid = await this.fbSvc.getCurrentUid();
    this.callID = this.jitsiCall.startCall()

    if(uid){
      this.openFrame();
      const fcmToken = this.fcmService.getToken(); 
      const userId = this.contact.userId;
      const meetingId = this.callID;
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

  openFrame() {
    this.callFrame.emit(this.callID);
  }


}

