import { Component, Input, OnInit } from '@angular/core';
import { message } from 'src/app/models/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  standalone: false
})
export class MessageComponent  implements OnInit {

  @Input() message: message = {
    content: '',
    from: '',
    type: '',
    date: 0
  };

  constructor() { }

  ngOnInit() {}

}
