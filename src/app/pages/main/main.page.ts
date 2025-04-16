import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FirebaseService } from 'src/app/core/services/firebase.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: false
})
export class MainPage implements OnInit {
  selectedTab = 'home';
  user: any;

  constructor(private firebaseSrv: FirebaseService) { 
    
  }

  ngOnInit() {
    this.firebaseSrv.getCurrentUserData().then(docSnap => {
      if (docSnap && docSnap.exists()) {
        const userData = docSnap.data();
        this.user=userData;
      } else {
        this.user= null;
        console.log('No se encontró la información del usuario.');
      }
    })
    
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

}
