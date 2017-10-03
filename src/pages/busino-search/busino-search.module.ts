import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinoSearchPage } from './busino-search';

import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    BusinoSearchPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(BusinoSearchPage),
  ],
})
export class BusinoSearchPageModule {}
