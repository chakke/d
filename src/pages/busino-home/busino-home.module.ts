import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinoHomePage } from './busino-home';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    BusinoHomePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(BusinoHomePage),
  ],
})
export class BusinoHomePageModule { }
