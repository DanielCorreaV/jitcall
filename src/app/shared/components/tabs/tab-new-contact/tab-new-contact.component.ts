import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-tab-new-contact',
  templateUrl: './tab-new-contact.component.html',
  styleUrls: ['./tab-new-contact.component.scss'],
  standalone: false
})
export class TabNewContactComponent  implements OnInit {

  newContactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usr: UserService,
    private fbSvc: FirebaseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { 
    this.newContactForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]] 
    });
  }

  ngOnInit() {}

  onSubmit(){
    if(this.newContactForm.valid){

      this.usr.addContact(this.newContactForm.value, this.fbSvc.getCurrentUid()).then(res=>{
        console.log(res);
      }).catch(err=>{
        console.log(err)
      })

    }

  }

}
