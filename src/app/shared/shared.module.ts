import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactItemComponent } from './components/contact-item/contact-item.component';
import { IonicModule } from '@ionic/angular';
import { TabContactsComponent } from './components/tabs/tab-contacts/tab-contacts.component';
import { TabHomeComponent } from './components/tabs/tab-home/tab-home.component';
import { TabProfileComponent } from './components/tabs/tab-profile/tab-profile.component';
import { TabNewUserComponent } from './components/tabs/tab-new-user/tab-new-user.component';
import { ReactiveFormsModule } from '@angular/forms';

const components=[
  ContactItemComponent,
  TabContactsComponent,
  TabHomeComponent,
  TabProfileComponent,
  TabNewUserComponent
];

@NgModule({
  declarations: [components],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule 
  ],
  exports: [components]
})
export class SharedModule { }
