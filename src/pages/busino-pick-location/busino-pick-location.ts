import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { NSegmentItem } from '../../components/n-segment/n-segment';

@IonicPage()
@Component({
  selector: 'page-busino-pick-location',
  templateUrl: 'busino-pick-location.html',
})
export class BusinoPickLocationPage {

  // for header segment
  title: string = 'Chọn điểm đi';
  segments: Array<NSegmentItem> = [{ text: "Google", selectedImg: "", unSelectedImg: "" }, { text: "Bản đồ", selectedImg: "", unSelectedImg: "" }, { text: "Điểm dừng", selectedImg: "", unSelectedImg: "" }];
  root = "BusinoHomePage";
  bgimg = "assets/busino/top_bar.png";
  color: string = 'white';
  btmColor = "#FAC132";
  rgtColor = "lightgrey";

  type: number;
  FROM = 1;
  TO = 2;
  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    this.type = navParams.data['type'];
    if (this.type == this.FROM) {
      this.title = "Chọn điểm đi"
    }
    else {
      this.title = "Chọn điểm đến"
    }
    console.log(this.type);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinoPickLocationPage');
  }

  onChangeView(view) {
    console.log(view);

  }

}
