import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ChatService } from 'src/app/core/services/chat.service';
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
  Contacts: Contact[] = [];
  chats:any;

  constructor(
    private usr: UserService,
    private fbSvc: FirebaseService,
    private navCtrl: NavController,
    private chat: ChatService
  ) {
    this.ViewonEnter();
  }

  async ngOnInit() {
  }

  async ViewonEnter() {
    this.init();
  }

  async init(){
    const uid = await this.fbSvc.getCurrentUid();

    if (uid) {
      this.usr.getContacts(uid).subscribe(contacts => {
        this.Contacts = contacts;
      });

      this.chat.getChats(uid).subscribe(chats=>{
        this.chats = chats;
        console.log("chats: ",chats)
      });
    } else {
      console.error('Usuario no autenticado.');
    }

    this.fbSvc.getCurrentUserData().subscribe(res => {
      // console.log(res);
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

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.init();

      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

}

