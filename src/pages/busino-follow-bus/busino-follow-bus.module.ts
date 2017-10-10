import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinoFollowBusPage } from './busino-follow-bus';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    BusinoFollowBusPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(BusinoFollowBusPage),
  ],
})
export class BusinoFollowBusPageModule {}
