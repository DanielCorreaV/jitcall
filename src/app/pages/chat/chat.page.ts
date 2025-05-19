import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/core/services/chat.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UserService } from 'src/app/core/services/user.service';
import { Contact } from 'src/app/models/contact.model';
import { message } from 'src/app/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false
})
export class ChatPage implements OnInit {

  chatID="";
  contact: Contact ={
    name: "",
    surname: "",
    phone: "",
    image: ""
  };
  uid:string |null = null;
  messages: message[] | null = null;
  MsjType: string = "";
  messageText: any;

  constructor(private route: ActivatedRoute,private firebase: FirebaseService, private chatService: ChatService, private user: UserService) { 
    
  }

  async ngOnInit() {
    this.uid= await this.firebase.getCurrentUid();
    this.chatID = this.route.snapshot.paramMap.get('chatId') || '';
    this.chatService.getChatMessages(this.chatID).subscribe((data)=>{
      this.messages = data;
    });

    this.route.queryParams.subscribe(params => {
      const contactId = params['contactID'];
      this.user.getContactById(this.uid || "",contactId).then((data)=>{
        this.contact = data;
      })
    });
    
  }

  async sendMessage(){
    console.log(this.messageText);
    if(this.uid){
      const message: message = {
        content: this.messageText,
        from: this.uid,
        type: "text",
        date: Date.now()
      }
      this.chatService.sendMessage(this.chatID,message);
    }
    
    this.messageText = "";
  }

  sendFile(){

  }

}
