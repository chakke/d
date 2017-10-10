import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController, ViewController } from 'ionic-angular';

import {
  GoogleMaps, GoogleMapOptions, GoogleMapsEvent, GoogleMap,
  Marker, MarkerOptions,
  LatLng,
  Polyline, PolylineOptions
} from '@ionic-native/google-maps';

import { Route } from '../../providers/busino/classes/route';
import { Station } from '../../providers/busino/classes/station';
import { WayPoint } from '../../providers/busino/classes/waypoint';

@IonicPage()
@Component({
  selector: 'page-busino-route',
  templateUrl: 'busino-route.html',
})
export class BusinoRoutePage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild(Slides) slides: Slides;
  map: any;

  title = "";
  bgcolor = "#FDC21E";
  color = "white";

  segments = ["Điểm dừng", "Thông tin"];
  border = "orange";
  currentView: number = 0;
  isGo: boolean = true; // 0: go, 1: re

  // for setup way
  startStation: Station = new Station();
  betweenStations: Array<Station> = [];
  endStation: Station = new Station();
  goPolyline: any; // drew polyline
  rePolyline: any; // drew polyline
  goStations: Array<Marker> = [];
  reStations: Array<Marker> = [];
  //-----for setup way

  mRoute: Route = new Route();
  // mRoute = {
  //   mName: "Bến xe Gia Lâm - Bến xe Yên Nghĩa",
  //   mBusCount: "7 xe",
  //   mCode: "10B",
  //   mCost: "8000đ/lượt",
  //   mEnterprise: "Xí nghiệp Xe buýt Yên Viên (Hanoibus)",
  //   mFleedId: 71,
  //   mFrequency: "25-30 phút/chuyến",
  //   mGoWaypoint: {
  //     route_detail: "Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),"
  //   },
  //   mReturnWaypoint: {
  //     route_detail: "Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),Xí nghiệp Xe buýt Yên Viên (Hanoibus),"
  //   }
  // }
  resizableDiv: any;
  maxHeight = 0;
  itemHeight = 0;

  constructor(public navCtrl: NavController,
    private mModalController: ModalController,
    private mViewController: ViewController,
    private googleMaps: GoogleMaps,
    public navParams: NavParams) {

    this.mRoute = navParams.data['route'];
    this.title = "Tuyến: " + this.mRoute.mCode;
    this.setUpWay(this.mRoute.mGoWaypoint);

  }

  ionViewDidEnter() {
    this.resizableDiv = <HTMLDivElement>document.getElementById("another-div");
    this.maxHeight = this.resizableDiv.clientHeight;
    this.itemHeight = document.getElementsByClassName("route-item")[0].clientHeight;
    this.currentTitle = document.getElementById("titleS");

    try {
      this.loadMap();
    }
    catch (e) {
      console.log(e);
    }
  }

  onClickClose() {
    this.navCtrl.pop();
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

      // draw polylines, 1 visible 1 not
      this.draw(this.mRoute.mGoWaypoint.geo, true).then(data => {
        this.goPolyline = data;
      });
      this.draw(this.mRoute.mReturnWaypoint.geo, false).then(data => {
        this.rePolyline = data;
      });

      this.putStations(this.mRoute.mGoWaypoint.stations, true).then(data => {
        this.goStations = <Array<Marker>>data;
        this.goStations[0].showInfoWindow();
      });
      this.putStations(this.mRoute.mReturnWaypoint.stations, false).then(data => {
        this.reStations = <Array<Marker>>data;
      });;
      this.animateCamera(this.mRoute.mGoWaypoint.stations[0].location);
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

  draw(path: Array<LatLng>, status: boolean) {
    return new Promise((resolve, reject) => {
      let color: string = '#E14B4C';

      let pathOptions: PolylineOptions = {
        points: path,
        color: color,
        width: 3,
        visible: status
      }

      this.map.addPolyline(pathOptions).then((data: Polyline) => {
        resolve(data);
      }, () => {
        reject();
      });
    })
  }

  putStations(stations: Array<Station>, status: boolean) {
    return new Promise((resolve, reject) => {
      let tempStations: Array<Marker> = [];
      for (let i = 0; i < stations.length; i++) {
        let station = stations[i];

        let markerOption: MarkerOptions = {
          position: station.location,
          title: station.name,
          flat: true,
          visible: status,
          icon: {
            url: 'assets/busino/busstop.png',
            size: {
              width: 20,
              height: 20
            }
          },
          zIndex: 0
        }

        this.map.addMarker(markerOption).then((marker: Marker) => {
          marker.on(GoogleMapsEvent.INFO_CLICK).subscribe((latLng: LatLng) => {
            this.followAnotherStation(station);
          });
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((latLng: LatLng) => {
            // this.blockCameraEnd = true;
            this.onClickMarker(station);
          });
          tempStations.push(marker);
          station.setMarker(marker);
        });
      }
      resolve(tempStations)
    })
  }

  onClickMarker(station) {
    console.log(document.getElementById("routes-container").clientHeight);
    let scrollElm = document.getElementById("routes-container")
    let scrollRange: number = 0;
    let mtitle: HTMLSpanElement;
    let micon: HTMLImageElement;
    if (station == this.startStation) {
      mtitle = document.getElementById("titleS");
    }
    else if (station == this.endStation) {
      mtitle = document.getElementById("titleE");
      scrollRange = scrollElm.scrollHeight - scrollElm.clientHeight / 2 + this.itemHeight * 0.5;
    }
    else {
      for (let i = 0; i < this.betweenStations.length; i++) {
        if (station == this.betweenStations[i]) {
          mtitle = <HTMLSpanElement>document.getElementsByClassName("titleB")[i];
          micon = <HTMLImageElement>document.getElementsByClassName("iconB")[i];

          scrollRange = (i + 1) * this.itemHeight - scrollElm.clientHeight / 2 + this.itemHeight * 0.5;
          break;
        }
      }
    }
    if (scrollRange < scrollElm.scrollHeight) {
      scrollElm.scrollTop = scrollRange;
    }
    else {
      scrollRange = scrollElm.scrollHeight;
      scrollElm.scrollTop = scrollRange;
    }
    this.EditRouteCss(mtitle, micon);
  }

  setUpWay(way: WayPoint) {
    this.startStation = way.stations[0];
    this.betweenStations = way.stations.slice(1, way.stations.length - 1);
    this.endStation = way.stations[way.stations.length - 1];
  }

  isOpen = true;
  onClickButton() {
    let minElm = <HTMLDivElement>document.getElementById("route-name-container");
    let minHeight = minElm.clientHeight;

    if (this.isOpen) {
      this.isOpen = false;
      this.resizableDiv.style.height = minHeight + "px";
      // mapElm.style.height = "80%";
    }
    else {
      this.isOpen = true;
      this.resizableDiv.style.height = this.maxHeight + "px";
      // this.resizableDiv.style.flex = "1";
      // mapElm.style.height = "50%";

    }
  }

  currentTitle: HTMLSpanElement;
  currentIcon: HTMLImageElement;
  onClickStation(station: Station, event, title: HTMLSpanElement, icon?: HTMLImageElement) {
    if (station.marker) {
      station.marker.showInfoWindow();
    }
    this.animateCamera(station.location);
    this.EditRouteCss(title, icon);
  }

  resetRouteCss() {
    this.currentTitle.style.fontWeight = "normal";
    this.currentTitle = document.getElementById("titleS");
    this.currentTitle.style.fontWeight = "bold";

    if (this.currentIcon) {
      this.currentIcon.src = "assets/circle-outline.png"
      this.currentIcon = null;
    }
  }

  EditRouteCss(title: HTMLSpanElement, icon?: HTMLImageElement) {
    this.currentTitle.style.fontWeight = "normal";
    this.currentTitle = title;
    if (this.currentIcon) {
      this.currentIcon.src = "assets/circle-outline.png"
      this.currentIcon = null;
    }
    this.currentTitle.style.fontWeight = "bold";
    if (icon) {
      this.currentIcon = icon;
      this.currentIcon.src = "assets/circle-filled.png"
    }

  }

  setView(view) {
    this.currentView = view;
  }

  onChangeView(view) {
    this.setView(view);
    this.goToSlide(view);
  }

  goToSlide(slide) {
    this.slides.slideTo(slide, 500);
  }

  changeDirection() {
    this.isGo = !this.isGo;
    let currentWayPoint: WayPoint;
    let enableStations: Array<Marker> = [];
    let disableStations: Array<Marker> = [];
    let enablePolyline: Polyline;
    let disablePolyline: Polyline;

    if (this.isGo) {
      currentWayPoint = this.mRoute.mGoWaypoint;
      enableStations = this.goStations;
      disableStations = this.reStations;
      enablePolyline = this.goPolyline;
      disablePolyline = this.rePolyline;
    }
    else {
      currentWayPoint = this.mRoute.mReturnWaypoint;
      enableStations = this.reStations;
      disableStations = this.goStations;
      enablePolyline = this.rePolyline;
      disablePolyline = this.goPolyline;
    }
    this.animateCamera(currentWayPoint.stations[0].location);
    this.setUpWay(currentWayPoint);
    this.changeStations(enableStations, disableStations);
    this.changePolyline(enablePolyline, disablePolyline);
    this.resetRouteCss();
  }

  changePolyline(enable: Polyline, disable: Polyline) {
    if (disable) {
      disable.setVisible(false);
    }

    if (enable) {
      enable.setVisible(true);
    }
  }

  changeStations(enable: Array<Marker>, disable: Array<Marker>) {
    if (disable) {
      disable.forEach(station => {
        station.setVisible(false);
      })
    }

    if (enable) {
      enable.forEach(station => {
        station.setVisible(true);
      })
    }
  }

  followAnotherStation(station: Station) {
    // let modal = this.mModalController.create("BusinoFollowBusPage", { station: station });

    // modal.present({ animate: false }).then(() => {
    this.navCtrl.push("BusinoFollowBusPage", { station: station }, { animate: false }).then(() => {

      this.navCtrl.remove(this.mViewController.index, 1);
    });
  }
}
