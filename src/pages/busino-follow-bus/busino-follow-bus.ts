import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController, ViewController } from 'ionic-angular';

import { BusinoModule } from '../../providers/busino/busino';
import { Station } from '../../providers/busino/classes/station';
import { Route } from '../../providers/busino/classes/route';

@IonicPage()
@Component({
  selector: 'page-busino-follow-bus',
  templateUrl: 'busino-follow-bus.html',
})
export class BusinoFollowBusPage {
  @ViewChild(Slides) slides: Slides;
  title = "Theo dõi xe";
  segments = ["Xe sắp đến", "Tuyến đi qua"];
  bgcolor = "#FDC21E";
  color = "white";
  titleUrl = "assets/star.png"

  mStation: Station = new Station();
  // mStation = {
  //   name: "AAAAA",
  //   fleetOver: ""
  // }
  mRoutes: Array<Route> = [];

  currentView: number = 0;

  constructor(public navCtrl: NavController,
    private mViewController: ViewController,
    private mModalController: ModalController,
    public mBusinoModule: BusinoModule,
    public navParams: NavParams) {
    this.mStation = navParams.data['station'];
    this.onGetRoutes();
    console.log(this.mStation);
    console.log(this.mRoutes);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinoFollowBusPage');
  }
  onClickClose() {
    this.navCtrl.pop();
  }

  setView(view) {
    this.currentView = view;
  }

  getView() {
    return this.currentView;
  }

  onGetRoutes() {
    this.mStation.routes.forEach(routeCode => {
      this.mRoutes.push(this.mBusinoModule.getRouteByCode(routeCode));
    })
  }

  onChangeView(view) {
    this.goToSlide(view);
  }

  goToSlide(slide) {
    this.slides.slideTo(slide, 500);
  }

  ionSlideDidChange() {
    this.setView(this.slides.getActiveIndex());
  }

  onClickRoute(route) {
    // let modal = this.mModalController.create("BusinoRoutePage", { route: route });

    // modal.present({ animate: false }).then(() => {
      this.navCtrl.push("BusinoRoutePage", { route: route }, { animate: false }).then(() => {

      this.navCtrl.remove(this.mViewController.index, 1);
    });
    // this.navCtrl.push("BusinoRoutePage", { route: route });
  }
}
