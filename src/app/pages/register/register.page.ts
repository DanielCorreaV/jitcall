import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseSvc: FirebaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) { 
    this.registerForm= this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  ngOnInit() {
  }

  async onSubmit() {

    const loading = await this.loadingCtrl.create({
      message: 'Creating account...',
      spinner: 'circles',
      backdropDismiss: false
    });
    loading.present();

    if (this.registerForm.valid) {
  
      this.firebaseSvc.register(this.registerForm.value).then(async () => {
        await loading.dismiss();
  
        const toast = await this.toastCtrl.create({
          message: 'Registered successfully!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        toast.present();
  
        this.registerForm.reset();
        this.router.navigate(['/login']);
      }).catch(async err => {
        await loading.dismiss();
  
        const toast = await this.toastCtrl.create({
          message: 'Something went wrong, try later',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      });
    }
    else{
      loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Invalid data',
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }

}
