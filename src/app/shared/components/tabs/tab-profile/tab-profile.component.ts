import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';

@Component({
  selector: 'app-tab-profile',
  templateUrl: './tab-profile.component.html',
  styleUrls: ['./tab-profile.component.scss'],
  standalone: false
})
export class TabProfileComponent  implements OnInit {

  
  profileForm!: FormGroup;
  isEditing:boolean = false;
  
  @Input() user: any;

  constructor(private fb: FormBuilder,private firebaseSrv: FirebaseService) { 
    
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
    });
    
  }

  ngOnInit() {
    
    this.profileForm.disable();
  }

  ngOnChanges() {
    if (this.user) {
      this.setUserData(this.user);
    }
  }

  setUserData(user: any) {
    this.profileForm.patchValue({
      name: user.name || '',
      surname: user.surname || '',
      email: user.email || '',
      phone: user.phone || ''
    });
  }

  toggleEdit(){
    this.isEditing = !this.isEditing;
    if(this.isEditing) this.profileForm.enable();
  }

  logOut(){
    this.firebaseSrv.logOut();
  }

  onSubmit(){
    if(this.profileForm.valid){
      console.log(this.profileForm.value);
      this.toggleEdit();
    }

  }

}
