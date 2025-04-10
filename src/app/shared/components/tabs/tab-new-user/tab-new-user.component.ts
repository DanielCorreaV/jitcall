import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tab-new-user',
  templateUrl: './tab-new-user.component.html',
  styleUrls: ['./tab-new-user.component.scss'],
  standalone: false
})
export class TabNewUserComponent  implements OnInit {

  newContactForm: FormGroup

  constructor(private fb: FormBuilder) { 
    this.newContactForm = this.fb.group({
      name: [''],
      number: ['']
    })
  }

  ngOnInit() {}

  onSubmit(){

  }

}
