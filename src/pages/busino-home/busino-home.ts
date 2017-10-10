import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { BusinoModule } from '../../providers/busino/busino';

@IonicPage()
@Component({
  selector: 'page-busino-home',
  templateUrl: 'busino-home.html',
})
export class BusinoHomePage {
  homeSegments: Array<string> = ['Theo dõi xe', 'Tìm đường'];
  bottomColor = "orange";
  rightColor = "lightgrey";
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public mBusinoModule: BusinoModule,
    public mMenuController: MenuController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinoHomePage');
  }

  openMenu() {
    this.mMenuController.open();
  }

  onChangeView(number){
    console.log("from page: " + number);

  }

  onClickBusino(){
    
    this.navCtrl.push("BusinoRoutePage", {route: this.mBusinoModule.getRouteByCode("06D")})
  }
}
