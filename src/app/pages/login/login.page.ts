import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private firebaseSvc: FirebaseService, private router: Router, private toastCtrl: ToastController, private loadingCtrl: LoadingController) { 
    this.loginForm= this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  ngOnInit() {
    
  }

  async onSubmit(){

    if(this.loginForm.valid){
      const loading = await this.loadingCtrl.create({
        message: 'Logging in...',
        spinner: 'circles',
        backdropDismiss: false
      });
      await loading.present();
    
      const { email, password } = this.loginForm.value;
    
      try {
        await this.firebaseSvc.login(email, password).then(res => {
          res.user.getIdToken().then(token => {
            localStorage.setItem('access_token', token);
          });
          localStorage.setItem('refresh_token', res.user.refreshToken);        
        });

        
        await loading.dismiss();
    
        const toast = await this.toastCtrl.create({
          message: 'Login successful!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
    
        
        this.router.navigate(['/main']);
        
        
      } catch (error) {
        await loading.dismiss();
    
        const toast = await this.toastCtrl.create({
          message: 'Login failed. Check your credentials.',
          duration: 3000,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      }
    }

  }

}
