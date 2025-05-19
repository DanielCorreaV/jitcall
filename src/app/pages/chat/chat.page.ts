import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false
})
export class ChatPage implements OnInit {

  chatID="";
  constructor(private router: Router,private route: ActivatedRoute,) { }

  ngOnInit() {
    this.chatID = this.route.snapshot.paramMap.get('chatId') || '';
  }

}
