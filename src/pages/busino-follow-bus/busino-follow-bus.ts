import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-busino-follow-bus',
  templateUrl: 'busino-follow-bus.html',
})
export class BusinoFollowBusPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinoFollowBusPage');
  }
  onClickClose() {
    this.navCtrl.pop();
  }

}
