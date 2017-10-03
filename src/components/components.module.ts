import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NSegmentComponent } from './n-segment/n-segment';
import { NHeaderSegmentComponent } from './n-header-segment/n-header-segment';
@NgModule({
	declarations: [
		NSegmentComponent,
		NHeaderSegmentComponent
	],
	imports: [
		IonicPageModule
	],
	exports: [
		NSegmentComponent,
		NHeaderSegmentComponent
	]
})
export class ComponentsModule { }
