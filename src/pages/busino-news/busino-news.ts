import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-busino-news',
  templateUrl: 'busino-news.html',
})
export class BusinoNewsPage {
  
  // header contributes
  title = "Tin buýt";
  root = "BusinoHomePage";
  segments = ["Tin Hanoibus", "Điểm báo"];
  bgcolor = "#FDC21E";
  color = "white";

  // -------------------
  currentView: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinoNewsPage');
  }

  onChangeView(view) {
    this.currentView = view;
    console.log("View: " + view);
  }
}
