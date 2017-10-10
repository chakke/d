import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import {
  GoogleMaps, GoogleMapOptions, GoogleMapsEvent, GoogleMap,
  Marker, MarkerOptions,
  LatLng,
  Polyline, PolylineOptions
} from '@ionic-native/google-maps';

import { BusinoModule } from '../../providers/busino/busino';
import { NSegmentItem } from '../../components/n-segment/n-segment';



@IonicPage()
@Component({
  selector: 'page-busino-home',
  templateUrl: 'busino-home.html',
})
export class BusinoHomePage {
  // @ViewChild('map') mapElement: ElementRef;
  map: any;

  homeSegments: Array<NSegmentItem> = [
    { text: 'Theo dõi xe', selectedImg: "assets/busino/icon_track_2.png", unSelectedImg: "assets/busino/icon_track_1.png" },
    { text: 'Tìm đường', selectedImg: "assets/busino/icon_find_2.png", unSelectedImg: "assets/busino/icon_find_1.png" }
  ];
  bottomColor = "#FAC132";
  rightColor = "lightgrey";

  currentView: number = 0;

  // searchbar contributes
  mSearchInput: string = "";
  mPlaceholder: string = "Tìm kiếm điểm dừng...";
  mShouldShowCancel: boolean = false;
  isSearching: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private googleMaps: GoogleMaps,
    public mBusinoModule: BusinoModule,
    public mMenuController: MenuController) {

  }

  ionViewDidEnter() {
    let a: Map<string, Array<string>> = new Map<string, Array<string>>();

    a.set("AAA", ["AA1", "AA2"]);
    a.set("bbb", ["bb1", "bb2"]);

    console.log(a.entries());


    let m = [];
    let t = {
    }


    try {
      this.loadMap();
    }
    catch (e) {
      console.log(e);
    }
  }

  loadMap() {
    let element: HTMLElement = document.getElementById('map');

    this.map = this.googleMaps.create(element);

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('Map is ready!');

      let mapOptions: GoogleMapOptions = {
        mapType: 'MAP_TYPE_NORMAL',
        controls: {
          compass: false,
          myLocationButton: false,
          indoorPicker: false,
          mapToolbar: false
        },
        gestures: {
          scroll: true,
          tilt: false,
          zoom: true,
          rotate: false,
        },
        styles: [
          {
            featureType: "transit.station.bus",
            stylers: [
              {
                "visibility": "off"
              }
            ]
          }
        ],
        camera: {
          target: new LatLng(21.027764, 105.834160),
          zoom: 15,
          tilt: 0
        },
        preferences: {
          zoom: {
            minZoom: 10,
            maxZoom: 16
          },
          building: false,
        }
      }
      this.map.setOptions(mapOptions);

      // this.animateCamera();
    });
  }

  removeMap() {
    if (this.map) {
      this.map.remove();
    }
  }

  animateCamera(location: LatLng) {
    if (this.map) {
      this.map.animateCamera({
        target: location,
        duration: 400
      });
    }
  }

  openMenu() {
    this.mMenuController.open();
  }

  onChangeView(view) {
    console.log("from page: " + view);
    this.currentView = view;
  }

  onClickSearchStation() {

  }

  FROM = 1;
  TO = 2;
  onClickFindPath(type){
    this.navCtrl.push("BusinoPickLocationPage", {type: type}, {animate: false})
  }










  onClickBusino() {

    this.navCtrl.push("BusinoRoutePage", { route: this.mBusinoModule.getRouteByCode("06D") })
  }
}
