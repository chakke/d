import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinoRoutePage } from './busino-route';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    BusinoRoutePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(BusinoRoutePage),
  ],
})
export class BusinoRoutePageModule {}
