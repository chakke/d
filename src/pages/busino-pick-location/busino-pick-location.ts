import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {
  GoogleMaps, GoogleMapOptions, GoogleMapsEvent, GoogleMap,
  Marker, MarkerOptions,
  LatLng,
  Polyline, PolylineOptions
} from '@ionic-native/google-maps';

import { NSegmentItem } from '../../components/n-segment/n-segment';

import { Utils } from '../../providers/app-utils';
import { BusinoModule } from '../../providers/busino/busino';
import { Station } from '../../providers/busino/classes/station';

declare var google;

@IonicPage()
@Component({
  selector: 'page-busino-pick-location',
  templateUrl: 'busino-pick-location.html',
})
export class BusinoPickLocationPage {
  @ViewChild('map') mapElement: ElementRef;

  // for header segment
  title: string = 'Chọn điểm đi';
  segments: Array<NSegmentItem> = [{ text: "Google", selectedImg: "", unSelectedImg: "" }, { text: "Bản đồ", selectedImg: "", unSelectedImg: "" }, { text: "Điểm dừng", selectedImg: "", unSelectedImg: "" }];
  root = "BusinoHomePage";
  bgimg = "assets/busino/top_bar.png";
  bgColor = "white";
  color: string = 'white';
  btmColor = "#FAC132";
  rgtColor = "lightgrey";

  // searchbar contributes
  mSearchInput: string = "";
  mPlaceholder: string = "Tìm địa điểm...";
  mShouldShowCancel: boolean = false;
  isSearching: boolean = false;

  // google place api
  geocoder = new google.maps.Geocoder;
  autocompleteService = new google.maps.places.AutocompleteService();
  places: any = [];

  mBusStopData: Array<Station> = [];
  currentBsData: Array<Station> = []; // busstop data

  // for view
  type: number;
  FROM = 1;
  TO = 2;

  VIEW_GOOGLE = 0;
  VIEW_MAP = 1;
  VIEW_STATION = 2;
  currentView: number = this.VIEW_GOOGLE;
  virtualClassBs = "virtual-hide";
  //------

  map: any;

  targetAddress = "";
  requestingAddress = "Đang xác định...";

  constructor(public navCtrl: NavController,
    private googleMaps: GoogleMaps,
    private mBusinoModule: BusinoModule,
    public navParams: NavParams) {
    this.type = navParams.data['type'];
    if (this.type == this.FROM) {
      this.title = "Chọn điểm đi"
    }
    else {
      this.title = "Chọn điểm đến"
    }

    this.mBusStopData = Array.from(this.mBusinoModule.getBusStation().values());
    this.currentBsData = this.mBusStopData;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinoPickLocationPage');
    // this.loadMap();
    // this.initMap();

  }

  initMap() {

    let latLng = new google.maps.LatLng(-34.9290, 138.6010);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  }

  loadMap() {
    let element: HTMLElement = document.getElementById('map-pick-location');

    try {
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

        this.map.on("camera_move_end").subscribe((cameraPosition) => {
          this.findAddress(cameraPosition[0].target);
        })

        this.map.getMyLocation().then(data => {
          this.animateCamera(data.latLng);
        });
      });
    }
    catch (e) {
      console.log(e);

    }
  }

  removeMap() {
    console.log("removeMap");

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

  isRequestingAddr = false;
  findAddress(location: LatLng) {
    this.targetAddress = "";
    this.mBusinoModule.requestAddress(location).then(addr => {
      this.targetAddress = addr + "";
    });
  }

  onChangeView(view) {
    if (view != this.currentView) {
      this.onSearchInput();
      this.currentView = view;
      this.mSearchInput = "";

      let elm = document.getElementById("main-content")
      if (view == this.VIEW_STATION) {
        this.removeMap();
        this.virtualClassBs = "";
      }
      else {
        this.virtualClassBs = "virtual-hide";
        if (view == this.VIEW_MAP) {
          this.loadMap();
        }
        else {
          this.removeMap();
        }
      }
    }
  }

  // searchbar func
  onSearchInput() {
    this.isSearching = true;
    this.scrollToTop();

    let query: string = this.mSearchInput.toLocaleLowerCase().trim();


    if (Utils.kiemTraToanDauCach(query)) {
      if (!query) {
        this.isSearching = false;
      }
      this.recoverRawData();
      return;
    }

    if (this.mSearchInput.length > 0) {
      if (this.currentView == this.VIEW_STATION) {
        this.currentBsData = this.mBusStopData.filter(elm => {
          return (elm.search.indexOf(query) !== -1) || (elm.search.indexOf(Utils.bodauTiengViet(query)) !== -1);
        })
      }
      else if (this.currentView == this.VIEW_GOOGLE) {
        this.searchPlace(query);
      }
    }
    else {
      this.recoverRawData();
    }
  }

  onSearchCancel() {
    this.isSearching = false;
  }

  recoverRawData() {
    // this.currentBrData = this.mSearchData;
    this.currentBsData = this.mBusStopData;
    this.places = [];
  }


  onClickStation(station: Station) {

  }

  searchPlace(query) {
    // this.saveDisabled = true;

    if (query.length > 0) {//} && !this.searchDisabled) {

      var hanoi = new google.maps.LatLng(21.027764, 105.834160);
      let config = {
        types: ['geocode'],
        location: hanoi,
        radius: 50000,
        // strictBounds: true,
        componentRestrictions: { country: "vn" },
        input: query
      }

      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {
        console.log(predictions);

        if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {

          this.places = [];

          predictions.forEach((prediction) => {
            let length = prediction.terms.length;
            if (length >= 3){
              // && prediction.terms[length - 1].value == 'Vietnam'
              // && prediction.terms[length - 2].value == 'Hanoi') {
              this.places.push(prediction);
            }
          });
        }

      });

    } else {
      this.places = [];
    }

  }

  selectPlace(place) {
    console.log(place);

  }

  requestObject: any;
  scrollToTop() {
    return new Promise((resolve, reject) => {
      let elm = document.querySelector("#main-content .scroll-content");
      if (elm.scrollTop <= 50) {
        elm.scrollTop = 0;
        if (this.requestObject) {
          cancelAnimationFrame(this.requestObject);
        }
        resolve();
      }
      else {
        elm.scrollTop -= elm.scrollTop / 2;

        this.requestObject = requestAnimationFrame(() => {
          this.scrollToTop();
        });
      }
    })
  }
}
