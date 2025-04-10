import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tab-profile',
  templateUrl: './tab-profile.component.html',
  styleUrls: ['./tab-profile.component.scss'],
  standalone: false
})
export class TabProfileComponent  implements OnInit {

  
  profileForm!: FormGroup;
  isEditing:boolean = false;

  constructor(private fb: FormBuilder) { 
    
    
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: [''],
      surname: [''],
      email: [''],
      phone: ['']
    })
    this.profileForm.disable();
  }

  save(){
    this.toggleEdit();
  }

  toggleEdit(){
    this.isEditing = !this.isEditing;
  }

  deleteProfile(){

  }
}
