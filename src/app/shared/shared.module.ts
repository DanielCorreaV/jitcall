import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactItemComponent } from './components/contact-item/contact-item.component';
import { IonicModule } from '@ionic/angular';
import { TabContactsComponent } from './components/tabs/tab-contacts/tab-contacts.component';
import { TabHomeComponent } from './components/tabs/tab-home/tab-home.component';
import { TabProfileComponent } from './components/tabs/tab-profile/tab-profile.component';

const components=[
  ContactItemComponent,
  TabContactsComponent,
  TabHomeComponent,
  TabProfileComponent
];

@NgModule({
  declarations: [components],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [components]
})
export class SharedModule { }
