import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { PickFilesService } from 'src/app/core/services/pickfiles.service';
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
  auxData: Contact | null = null;
  previewImage = '';
  editingImage = false;

  constructor(
    private fb: FormBuilder,
    private usr: UserService,
    private fbSvc: FirebaseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private pickFiles: PickFilesService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
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
      console.log("se ejecuta el oninit perro");
      this.setUserData(this.user);
      this.auxData = { ...this.user };
      this.previewImage = this.user["image"] || '';
      console.log("aux data: ", this.auxData)
    }
  }

  setUserData(user: Contact) {
    this.profileForm.patchValue({
      name: user.name || '',
      surname: user.surname || '',
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
      this.usr.editUser(this.profileForm.value, this.uid, this.editingImage).then(async () => {
        await loading.dismiss();
        this.auxData = this.profileForm.value;

        const toast = await this.toastCtrl.create({
          message: 'Account updated successfully!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        toast.present();
        this.toggleEdit();
        this.editingImage = false;
      }).catch(async err => {
        await loading.dismiss();
        console.log(err);

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

  async onFileSelected() {
    const result = await this.pickFiles.pickFiles();

    if (result) {
      if (this.user) {
        console.log(result.base64Src)
        this.previewImage = result.base64Src;
      }

      this.profileForm.patchValue({
        image: result.base64
      });
      this.editingImage = true;

    }
  }

  async cancelEdit() {
  if (this.auxData) {
    // Restaurar el formulario
    this.profileForm.reset({
      name: this.auxData.name,
      surname: this.auxData.surname,
      image: this.auxData.image
    });
    this.previewImage = this.auxData.image || '';

    // Restaurar el objeto user con una copia para evitar referencias compartidas
    this.user = { ...this.auxData };
    this.editingImage = false;
    // Desactivar modo de edición y deshabilitar el formulario
    this.isEditing = false;
    this.profileForm.disable();
  }
}

}

