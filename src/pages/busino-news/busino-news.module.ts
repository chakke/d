import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinoNewsPage } from './busino-news';

import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    BusinoNewsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(BusinoNewsPage),
  ],
})
export class BusinoNewsPageModule {}
