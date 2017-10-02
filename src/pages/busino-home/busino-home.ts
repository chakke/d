import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

/**
 * Generated class for the BusinoHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-busino-home',
  templateUrl: 'busino-home.html',
})
export class BusinoHomePage {

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
    public mMenuController: MenuController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinoHomePage');
  }

}
