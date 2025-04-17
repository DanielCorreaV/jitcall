import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UserService } from 'src/app/core/services/user.service';
import { Contact } from 'src/app/models/contact.model';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usr: UserService,
    private fbSvc: FirebaseService,
    private router: Router
  ) {
    this.ContactForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
    });
  }

  async ngOnInit() {
    this.ContactForm.disable();
    this.uid = await this.fbSvc.getCurrentUid();
    this.contactId = this.route.snapshot.paramMap.get('id') || '';

    if (this.contactId && this.uid) {
      const data = await this.usr.getContactById(this.uid, this.contactId);
      if (data) {
        this.contact = data;
        this.setContactData(this.contact);
      }
    }
  }

  setContactData(contact: Contact) {
    this.ContactForm.patchValue({
      name: contact.name || '',
      surname: contact.surname || '',
      phone: contact.phone || ''
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.isEditing ? this.ContactForm.enable() : this.ContactForm.disable();
  }

  async onSubmit() {
    if (this.ContactForm.valid && this.contactId && this.uid) {
      const updated = this.ContactForm.value;
      console.log('Updating contact with:', updated);

      await this.usr.editContact(updated, this.uid, this.contactId);
      this.toggleEdit();
    }
  }

  async deleteContact() {
    if (this.contactId && this.uid) {
      await this.usr.deleteContact(this.uid, this.contactId).then(() => {
        this.router.navigate(['/main']);
      });
    }
  }
}

