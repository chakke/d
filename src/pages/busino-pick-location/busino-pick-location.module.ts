import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinoPickLocationPage } from './busino-pick-location';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    BusinoPickLocationPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(BusinoPickLocationPage),
  ],
})
export class BusinoPickLocationPageModule {}
