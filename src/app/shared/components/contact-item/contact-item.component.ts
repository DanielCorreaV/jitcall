import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CallService } from 'src/app/core/services/call.service';
import { FcmService } from 'src/app/core/services/fcm.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';
import { JitsiPlugin } from 'jitsi-plugin/src';

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
    private jitsiCall: CallService,
    private usr: UserService
  ) { }

  ngOnInit() {
    console.log(this.contact);
  }

  async call(){

    const uid = await this.fbSvc.getCurrentUid();
    this.callID = this.jitsiCall.startCall()

    if(uid){
      //this.openFrame();
      const fcmToken = await this.usr.getTokenByPhone(this.contact.phone);
      const userId = this.contact.id;
      const meetingId = this.callID;
      const contactName = this.contact.name;
      const userFrom = uid;

      await JitsiPlugin.testPluginMethod({msg: "enviando..."})
      .then((res:any)=>{
        alert("return: "+ JSON.stringify(res.value));
      }
    )
    await this.handleStartCall();

/*      if (fcmToken) {
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
      }else{
        console.log("no hay fcm")
      }*/
    }
    
  }

  openFrame() {
    this.callFrame.emit(this.callID);
  }

  async handleStartCall() {
    try {
      const result = await JitsiPlugin.startCall();
      console.log('Llamada iniciada en sala:', result.room);
      // Puedes guardar el nombre de la sala, compartirlo o mostrarlo en pantalla
    } catch (error) {
      console.error('Error al iniciar la llamada:', error);
    }
  }

  async handleJoinCall(roomName: string) {
    try {
      await JitsiPlugin.joinCall({ room: roomName });
      console.log('Unido a la sala:', roomName);
    } catch (error) {
      console.error('Error al unirse a la llamada:', error);
    }
  }
  


}

