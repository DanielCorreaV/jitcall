import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UserService } from 'src/app/core/services/user.service';
import { Contact } from 'src/app/models/contact.model';

@Component({
  selector: 'app-tab-contacts',
  templateUrl: './tab-contacts.component.html',
  styleUrls: ['./tab-contacts.component.scss'],
  standalone: false
})
export class TabContactsComponent  implements OnInit {

  @Input() Contacts: any[]=[];


  constructor(private usr: UserService, private fbSvc: FirebaseService) { }

  ngOnInit() {
   
  }




}
