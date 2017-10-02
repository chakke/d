import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinoHomePage } from './busino-home';

@NgModule({
  declarations: [
    BusinoHomePage,
  ],
  imports: [
    IonicPageModule.forChild(BusinoHomePage),
  ],
})
export class BusinoHomePageModule {}
