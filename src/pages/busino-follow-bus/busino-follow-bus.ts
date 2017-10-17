import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController, ViewController } from 'ionic-angular';

import { BusinoModule } from '../../providers/busino/busino';
import { Station } from '../../providers/busino/classes/station';
import { Route } from '../../providers/busino/classes/route';

import { NSegmentItem } from '../../components/n-segment/n-segment';

@IonicPage()
@Component({
  selector: 'page-busino-follow-bus',
  templateUrl: 'busino-follow-bus.html',
})
export class BusinoFollowBusPage {
  @ViewChild(Slides) slides: Slides;

  // header contributes
  title: string = 'Theo dõi xe';
  segments: Array<NSegmentItem> = [
    { text: "Xe sắp đến", selectedImg: "", unSelectedImg: "" },
    { text: "Tuyến đi qua", selectedImg: "", unSelectedImg: "" }
  ];
  root = "BusinoHomePage";
  bgimg = "assets/busino/homepage/top_bar.png";
  bgColor = "white";
  color: string = 'white';
  btmColor = "#FAC132";
  rgtColor = "lightgrey";
  popData: any;

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
    console.log("ionSlideDidChange");
    
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
