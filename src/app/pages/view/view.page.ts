import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UserService } from 'src/app/core/services/user.service';
import { Contact } from 'src/app/models/contact.model';
//import { JitsiPlugin } from 'jitsi-plugin/src';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ChatService } from 'src/app/core/services/chat.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
  standalone: false
})
export class ViewPage implements OnInit {

  ContactForm: FormGroup;
  contact: Contact = {
    name: '',
    surname: '',
    phone: '',
    image: ''
  };
  isEditing = false;
  contactId: string = '';
  uid: string | null = null;
  auxData: Contact|null=null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usr: UserService,
    private fbSvc: FirebaseService,
    private router: Router,
    private notificationService: NotificationService,
    private chat: ChatService
  ) {
    this.ContactForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.ContactForm.disable();
    this.uid = await this.fbSvc.getCurrentUid();
    this.contactId = this.route.snapshot.paramMap.get('id') || '';

    if (this.contactId && this.uid) {
  this.usr.getContactById(this.uid, this.contactId).subscribe(data => {
    if (data) {
      this.contact = data;
      this.auxData = data;
      this.setContactData(this.contact);
      console.log('Contact data:', this.contact);
    }
  });
}

  }

  setContactData(contact: Contact) {
    this.ContactForm.patchValue({
      name: contact.name || '',
      surname: contact.surname || '',
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.isEditing ? this.ContactForm.enable() : this.ContactForm.disable();
  }

  onSubmit() {
    if (this.ContactForm.valid && this.contactId && this.uid) {
      const updated = this.ContactForm.value;
      console.log('Updating contact with:', updated);

      this.usr.editContact(updated, this.uid, this.contactId).then(() => {
        console.log('Contact updated successfully');
        this.contact.name = updated.name;
        this.contact.surname = updated.surname;
      }).catch((error) => {
        console.error('Error updating contact:', error);
      });
      this.toggleEdit();
    }else{
      console.log("error");
    }
  }

  async deleteContact() {
    if (this.contactId && this.uid) {
      await this.usr.deleteContact(this.uid, this.contactId).then(() => {
        this.router.navigate(['/main']);
      });
    }
  }

  async goBack() {
    await this.router.navigate(['/main']);
  }

  async goToChat() {
    if (this.contact && this.uid && this.contact.id) {
        this.chat.getChatID(this.uid, this.contact.id).then((res)=>{      
        this.router.navigate([`chat/${res}`],{
          queryParams:{
            contactID: this.contactId,
          }
        });     
      })
    }
  }

   async goToCall() {
  
  //   if (this.uid) {
  //     const fcmToken = await this.usr.getTokenByPhone(this.contact.phone);
  //     const userId = this.contactId;
  //     const contactName = this.contact.name;
  //     const userFrom = this.uid;
  
  //     let room = (await JitsiPlugin.createRoom()).meetingId;
  
  //     if (fcmToken && room) {
  //       this.notificationService
  //         .sendNotification(fcmToken, userId, room, contactName, userFrom)
  //         .subscribe({
  //           next: async (response) => {
  //             console.log('Notificación enviada con éxito:', response);
  //             try {
  //               await JitsiPlugin.joinCall({
  //                 meetingId: room,
  //                 userName: contactName 
  //               });
  //               console.log('Unido a la sala:', room);
  //             } catch (error) {
  //               console.error('Error al unirse a la sala:', error);
  //             }
  //           },
  //           error: (err) => {
  //             console.error('Error al enviar la notificación:', err);
  //           },
  //         });
  //     } else {
  //       console.log("No hay token FCM o room");
  //     }
  //   }
      
   }

  cancelEdit(){
    if(this.auxData){
      this.setContactData(this.auxData);
      this.toggleEdit();
    }
  }

}
