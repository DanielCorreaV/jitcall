import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UserService } from 'src/app/core/services/user.service';
import { Contact } from 'src/app/models/contact.model';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false
})

export class MainPage implements OnInit {
  selectedTab = 'contacts';
  user: any;
  Contacts: any[] = [];

  constructor(
    private usr: UserService,
    private fbSvc: FirebaseService,
    private navCtrl: NavController
  ) {
    this.ViewonEnter();
  }

  async ngOnInit() {
  }

  async ViewonEnter() {
    const uid = await this.fbSvc.getCurrentUid();

    if (uid) {
      this.usr.getContacts(uid).subscribe(contacts => {
        this.Contacts = contacts;
      });
    } else {
      console.error('Usuario no autenticado.');
    }

    this.fbSvc.getCurrentUserData().subscribe(res => {
      this.user = res;
    });
  }

  logOut() {
    this.fbSvc.logOut().then(res => {
      this.user = null;
      this.Contacts = [];
      this.navCtrl.navigateRoot('/login');

    })
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}

