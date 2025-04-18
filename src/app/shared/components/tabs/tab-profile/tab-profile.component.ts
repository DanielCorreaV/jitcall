import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UserService } from 'src/app/core/services/user.service';
import { Contact } from 'src/app/models/contact.model';

@Component({
  selector: 'app-tab-profile',
  templateUrl: './tab-profile.component.html',
  styleUrls: ['./tab-profile.component.scss'],
  standalone: false
})
export class TabProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing: boolean = false;

  @Input() user: Contact | null = null;
  uid: string = '';
  @Output() islogginOut = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private usr: UserService,
    private fbSvc: FirebaseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      image: ['']
    });

    this.fbSvc.getCurrentUid().then(res=>{
      if(res){
        this.uid = res;
      }
    })
    
  }

  async ngOnInit() {
    this.profileForm.disable();

    if (this.user) {
      this.setUserData(this.user);
    }
  }

  setUserData(user: Contact) {
    this.profileForm.patchValue({
      name: user.name || '',
      surname: user.surname || '',
      phone: user.phone || '',
      image: user.image || ''
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  logOut() {
    this.islogginOut.emit(true);
  }

  async onSubmit() {
    const loading = await this.loadingCtrl.create({
      message: 'Updating account...',
      spinner: 'circles',
      backdropDismiss: false
    });
    await loading.present();

    if (this.profileForm.valid) {
      this.usr.editUser(this.profileForm.value, this.uid).then(async () => {
        await loading.dismiss();

        const toast = await this.toastCtrl.create({
          message: 'Account updated successfully!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        toast.present();
        this.toggleEdit();
      }).catch(async err => {
        await loading.dismiss();

        const toast = await this.toastCtrl.create({
          message: 'Something went wrong, try later',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      });
    } else {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Invalid data',
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }
}

