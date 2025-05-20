import { Component, Input, OnInit } from '@angular/core';
import { chat } from 'src/app/models/chat.model';

@Component({
  selector: 'app-tab-chats',
  templateUrl: './tab-chats.component.html',
  styleUrls: ['./tab-chats.component.scss'],
  standalone: false
})
export class TabChatsComponent  implements OnInit {

  @Input() chats: any=null;

  constructor() { }

  ngOnInit() {}

}
