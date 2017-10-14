import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ViewController } from 'ionic-angular';

import {
  GoogleMaps, GoogleMapOptions, GoogleMapsEvent, GoogleMap,
  Marker, MarkerOptions,
  LatLng,
  Polyline, PolylineOptions
} from '@ionic-native/google-maps';

import { BusinoModule } from '../../providers/busino/busino';
import { Station } from '../../providers/busino/classes/station';
import { NSegmentItem } from '../../components/n-segment/n-segment';



@IonicPage()
@Component({
  selector: 'page-busino-home',
  templateUrl: 'busino-home.html',
})
export class BusinoHomePage {
  // @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;

  homeSegments: Array<NSegmentItem> = [
    { text: 'Theo dõi xe', selectedImg: "assets/busino/homepage/icon_track_2.png", unSelectedImg: "assets/busino/homepage/icon_track_1.png" },
    { text: 'Tìm đường', selectedImg: "assets/busino/homepage/icon_find_2.png", unSelectedImg: "assets/busino/homepage/icon_find_1.png" }
  ];
  bottomColor = "#FAC132";
  rightColor = "lightgrey";

  // searchbar contributes
  mSearchInput: string = "";
  mPlaceholder: string = "Tìm kiếm điểm dừng...";
  mShouldShowCancel: boolean = false;
  isSearching: boolean = false;

  currentView: number = 0;
  blockCameraEnd: boolean = true;

  // data
  from = {
    place: "",
    latlng: new LatLng(0, 0)
  }
  to = {
    place: "",
    latlng: new LatLng(0, 0)
  }

  stationsAround: Array<Station> = [];
  //-----------------

  constructor(public navCtrl: NavController,
    public mViewController: ViewController,
    public navParams: NavParams,
    private googleMaps: GoogleMaps,
    public mBusinoModule: BusinoModule,
    public mMenuController: MenuController) {
    this.resetFindData();
  }


  ionViewDidEnter() {
    console.log("ionViewDidEnter");



    if (!this.map) {
      try {
        this.loadMap();
      }
      catch (e) {
        console.log(e);
      }
    }
    else {
      this.visibleMap();
    }
  }

  loadMap() {
    let element: HTMLElement = document.getElementById('map');

    this.map = this.googleMaps.create(element);

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('Map is ready!');

      this.map.getMyLocation().then(data => {
        let mapOptions: GoogleMapOptions = {
          mapType: 'MAP_TYPE_NORMAL',
          controls: {
            compass: false,
            myLocationButton: true,
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
            target: data.latLng,
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

        // let marKerOptions: MarkerOptions = {
        //   position: data.latLng,
        //   visible: true,
        //   icon: {
        //     url: 'assets/busino/homepage/marker_location.png',
        //     size: {
        //       width: 40,
        //       height: 40
        //     }
        //   },
        //   zIndex: 0
        // };

        // this.map.addMarker(marKerOptions).then((marker: Marker) => {
        // });

        this.findStationsAround(data.latLng);
        this.showStations();

        this.map.on("camera_move_end").subscribe((cameraPosition) => {
          if (this.blockCameraEnd) {
            this.blockCameraEnd = false;
            return;
          }

          this.findStationsAround(cameraPosition[0].target);
          this.showStations();
        })
      });

    });
  }

  removeMap() {
    if (this.map) {
      this.map.remove();
    }
  }

  visibleMap() {
    if (this.map) {
      this.map.setVisible(true);
    }
  }

  inVisibleMap() {
    if (this.map) {
      this.map.setVisible(false);
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
    this.currentView = view;
    if(view == 0){
      this.showStations();
    }else{
      this.hideStations();
    }
  }

  onClickMyLocation() {
    this.getMyLocation()
  }

  getMyLocation() {
    if (this.map) {
      this.map.getMyLocation().then(data => {
        this.animateCamera(data.latLng);
      });
    }
  }

  findStationsAround(location: LatLng) {
    let oldStations = this.stationsAround;
    this.stationsAround = this.mBusinoModule.getStationsAround(location);
    this.updateStations(oldStations);
  }

  updateStations(oldStations: Array<Station>) {
    oldStations.forEach((station) => {
      let stationIndex = this.stationsAround.indexOf(station);
      if (stationIndex < 0) {
        if (station.marker) {
          station.marker.setVisible(false);
        }
      }
    });
  }

  showStations() {
    this.stationsAround.forEach(station => {
      if (!station.marker) {
        let title: string = "Địa chỉ: " + station.name + "\nTuyến xe: " + station.fleetOver;

        let marKerOptions: MarkerOptions = {
          position: station.location,
          visible: true,
          title: title,
          icon: {
            url: 'assets/busino/homepage/marker_busstop.png',
            size: {
              width: 60,
              height: 60
            }
          },
          zIndex: 0
        };

        this.map.addMarker(marKerOptions).then((marker: Marker) => {
          station.setMarker(marker);

          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((latLng: LatLng) => {
            // this.navCtrl.push("BusinoFollowVehiclePage", { stations: busStops });
            this.blockCameraEnd = true;
          });
        });
      }
      else {
        station.marker.setVisible(true);
      }
    });
  }

  hideStations(){
    this.stationsAround.forEach(station => {
      station.marker.setVisible(true);
    });
  }

  switchable = false;
  onClickSwitch() {
    if (this.switchable) {
      let temp: any = this.from.place
      this.from.place = this.to.place;
      this.to.place = temp;

      temp = this.from.latlng
      this.from.latlng = this.to.latlng;
      this.to.latlng = temp;
    }
  }

  FROM = 1;
  TO = 2;
  onClickFindPath(type) {
    this.navCtrl.push("BusinoPickLocationPage", { type: type, detail: (type == this.FROM) ? this.from : this.to, callback: this.getData }, { animate: false }).then(() => {
      // this.inVisibleMap();
    })
  }

  // callback
  getData = (data) => {
    return new Promise((resolve, reject) => {
      this.setFindData(data);
      console.log(data);
      resolve();
    });
  };

  resetFindData() {
    this.switchable = false;
    this.from.place = "";
    this.from.latlng = new LatLng(0, 0);
    this.to.place = "";
    this.to.latlng = new LatLng(0, 0);
  }

  setFindData(data) {
    this.switchable = true;
    if (data['type'] == this.FROM) {
      this.from.place = data['place'];
      this.from.latlng = data['latlng'];
    }
    else {
      this.to.place = data['place'];
      this.to.latlng = data['latlng'];
    }
  }









  onClickBusino() {
    this.visibleMap();
    // this.navCtrl.push("BusinoRoutePage", { route: this.mBusinoModule.getRouteByCode("06D") })
  }
}
