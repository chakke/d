import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Station } from '../../providers/busino/classes/station';

import { BusinoModule } from '../../providers/busino/busino';

@IonicPage()
@Component({
  selector: 'page-busino-busstop-detail',
  templateUrl: 'busino-busstop-detail.html',
})
export class BusinoBusstopDetailPage {

  title = "Điểm dừng";
  bgcolor = "#FDC21E";
  color = "white";

  mStation: Station = new Station();
  // mStation = {
  //   name: "",
  //   fleetOver: ""
  // }
  address: string = "";
  constructor(public navCtrl: NavController,
    private mBusinoModule: BusinoModule,
    public navParams: NavParams) {
    this.mStation = navParams.data['station'];
    console.log(this.mStation);
    mBusinoModule.requestAddress(this.mStation.location).then((data)=>{
      this.address = data + "";     
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinoBusstopDetailPage');
  }

  onClickClose() {
    this.navCtrl.pop();
  }

  onClickFollowBus() {
    console.log("onClickFollowBus");
    this.navCtrl.push("BusinoFollowBusPage")
  }

  onClickSaveStation() {
    console.log("onClickSaveStation");

  }

  onClickFromHere() {
    console.log("onClickFromHere");

  }

  onClickToHere() {
    console.log("onClickToHere");

  }
}
