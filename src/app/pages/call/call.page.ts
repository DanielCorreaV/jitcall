import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { JitsiPlugin } from 'jitsi-plugin/src';
import { FirebaseService } from 'src/app/core/services/firebase.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.page.html',
  styleUrls: ['./call.page.scss'],
  standalone: false
})
export class CallPage implements OnInit {
  name: string = '';
  meetingId: string = '';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private fbSvc: FirebaseService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.meetingId = params['meetingId'] || '';
    });

    this.fbSvc.getCurrentUserData().subscribe(res => {
      this.name = res.name;
    });
  }

  async joinCall() {
    this.handleJoinCall(this.meetingId);

    console.log(`Entrando a la sala: ${this.meetingId}`);

  }

  rejectCall() {
    this.navCtrl.navigateForward('/main');
  }

  async handleJoinCall(roomName: string) {
    try {
      await JitsiPlugin.joinCall({ meetingId: roomName, userName: this.name });
      console.log('Unido a la sala:', roomName);
    } catch (error) {
      console.error('Error al unirse a la llamada:', error);
    }
  }
}
