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
export class TabNewContactComponent implements OnInit {

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

  async onSubmit() {
    if (!this.newContactForm.valid) {
      const toast = await this.toastCtrl.create({
        message: 'Please fill in all fields correctly',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Saving contact...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      const uid = await this.fbSvc.getCurrentUid();

      if (uid) {
        await this.usr.addContact(this.newContactForm.value, uid);

        this.newContactForm.reset();

        const toast = await this.toastCtrl.create({
          message: 'Contact added successfully!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        toast.present();
      } else {
        throw new Error('User UID not found');
      }
    } catch (err) {
      console.error(err);
      const toast = await this.toastCtrl.create({
        message: 'Error adding contact. Try again later.',
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    } finally {
      loading.dismiss();
    }
  }
}
