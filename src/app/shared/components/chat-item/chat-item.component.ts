import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/core/services/chat.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
  standalone: false
})
export class ChatItemComponent  implements OnInit {

  contact: any;
  chatData: any;
  @Input() Data: any;
  uid: string | null = null;


  constructor(private fbSvc: FirebaseService, private usr: UserService, private chat: ChatService, private router: Router) { }


  async ngOnInit() {
    this.uid = await this.fbSvc.getCurrentUid();
    this.contact = this.Data.userData;
    this.chatData = this.Data.chatData;
  }

  async goToChat() {
    if (this.contact && this.uid) {
      const userContact = await this.usr.getUserByPhone(this.contact.phone);
      if(userContact){
        this.router.navigate([`chat/${this.Data.meta.id}`],{
          queryParams:{
            contactID: this.Data.meta.relatedUser,
          }
        });     
      }
    }
  }

}
