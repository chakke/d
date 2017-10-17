import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, Platform } from 'ionic-angular';

import {
  GoogleMaps, GoogleMapOptions, GoogleMapsEvent, GoogleMap,
  Marker, MarkerOptions,
  LatLng
} from '@ionic-native/google-maps';

import { NSegmentItem } from '../../components/n-segment/n-segment';

import { Utils } from '../../providers/app-utils';

import { BusinoModule } from '../../providers/busino/busino';
import { Route } from '../../providers/busino/classes/route';
import { Station } from '../../providers/busino/classes/station';

declare var google;

@IonicPage()
@Component({
  selector: 'page-busino-search',
  templateUrl: 'busino-search.html',
})
export class BusinoSearchPage {
  @ViewChild("mSearchBar") mSearchbar: Searchbar;
  @ViewChild('map-listpage') mapElement: ElementRef;
  map: GoogleMap;

  // header contributes
  title: string = 'Tra cứu';
  segments: Array<NSegmentItem> = [
    { text: "Tuyến buýt", selectedImg: "", unSelectedImg: "" },
    { text: "Điểm dừng", selectedImg: "", unSelectedImg: "" }
  ];
  root = "BusinoHomePage";
  bgimg = "assets/busino/homepage/top_bar.png";
  bgColor = "white";
  color: string = 'white';
  btmColor = "#FAC132";
  rgtColor = "lightgrey";
  popData: any;

  // searchbar contributes
  mSearchInput: string = "";
  mPlaceholder: string = "";
  mShouldShowCancel: boolean = false;
  isSearching: boolean = false;

  // -------------------
  mSearchData: Array<Route> = [];
  currentBrData: Array<Route> = []; // busroute data
  mBusStopData: Array<Station> = [];
  currentBsData: Array<Station> = []; // busstop data
  virtualClassBr = "";
  virtualClassBs = "virtual-hide";

  headerHeight = 150; // fixed to css
  contentHeight = 0;
  BUSROUTE: number = 0;
  BUSSTOP: number = 1;
  currentView: number = this.BUSROUTE;
  // -------------------

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public mPlatform: Platform,
    public mGoogleMaps: GoogleMaps,
    private mBusinoModule: BusinoModule) {
    this.contentHeight = mPlatform.height() - this.headerHeight;

    this.mSearchData = Array.from(this.mBusinoModule.getBusRoutes().values());
    this.currentBrData = this.mSearchData;
    this.mBusStopData = Array.from(this.mBusinoModule.getBusStations().values());
    this.currentBsData = this.mBusStopData;
  }

  ionViewDidEnter() {
    // this.initMap();
    this.loadMap();
  }
  ionViewDidLeave() {
  }

  loadMap() {
    let element: HTMLElement = document.getElementById('map-listpage');

    try {
      this.map = this.mGoogleMaps.create(element);

      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        let mapOptions: GoogleMapOptions = {
          mapType: 'MAP_TYPE_NORMAL',
          controls: {
            compass: false,
            myLocationButton: false,
            indoorPicker: false
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
        this.createStation();

      });
    }
    catch (e) {
      console.log(e);

    }
  }

  isAnimate = false;
  animateCamera(location: LatLng) {
    this.map.animateCamera({
      target: location,
      duration: 400
    }).then(() => {
      this.isAnimate = false;
    });
  }

  initMap() {
    var hanoi = { lat: 21.027764, lng: 105.834160 };
    var map = new google.maps.Map(document.getElementById('map-listpage'), {
      zoom: 12,
      center: hanoi,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });
    // var marker = new google.maps.Marker({
    //   position: uluru,
    //   map: map
    // });

    this.map = new google.maps.Map(this.mapElement.nativeElement, map);
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
      if (this.currentView == this.BUSROUTE) {
        this.currentBrData = this.mSearchData.filter(elm => {
          return (elm.search.indexOf(query) !== -1) || (elm.search.indexOf(Utils.bodauTiengViet(query)) !== -1);
        })
      }
      else {
        this.currentBsData = this.mBusStopData.filter(elm => {
          return (elm.search.indexOf(query) !== -1) || (elm.search.indexOf(Utils.bodauTiengViet(query)) !== -1);
        })
      }
    }
    else {
      this.recoverRawData();
    }
  }

  onSearchCancel() {
    this.isSearching = false;
  }

  onChangeView(view: number) {
    this.onSearchInput();
    this.currentView = view;
    this.mSearchInput = "";

    let elm = document.getElementById("main-content")
    if (view == this.BUSROUTE) {
      if (this.map) {
        this.map.remove()
      }
      this.virtualClassBr = "";
      this.virtualClassBs = "virtual-hide";

      elm.style.height = this.mPlatform.height() + "px";
    }
    else {
      this.loadMap();
      this.virtualClassBs = "";
      this.virtualClassBr = "virtual-hide";

      let fixedContentHeight = this.mPlatform.height() - this.contentHeight / 2;

      elm.style.height = fixedContentHeight + "px";


    }
  }

  recoverRawData() {
    this.currentBrData = this.mSearchData;
    this.currentBsData = this.mBusStopData;
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


  onClickStation(station: Station) {
    this.updateCurrentStation(station);
  }

  currentStation: Station = new Station;
  currentMarker: Marker;
  isAddingMarker: boolean = false;
  createStation() {
    let mMarkerOptions: MarkerOptions = {
      position: new LatLng(21.027764, 105.834160),
      title: "Hanoi",
      visible: false
    }
    if (this.map) {
      this.map.addMarker(mMarkerOptions).then((marker: Marker) => {
        marker.showInfoWindow();

        this.currentMarker = marker;

        marker.on(GoogleMapsEvent.INFO_CLICK).subscribe((latLng: LatLng) => {
          this.viewStationDetail(this.currentStation);
          marker.hideInfoWindow();
        });
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((latLng: LatLng) => {
          marker.showInfoWindow();
        });
      });
    }
  }

  updateCurrentStation(station) {
    if (!this.isAnimate) {
      this.isAnimate = true;

      this.currentMarker.hideInfoWindow();
      this.currentStation = station;
      this.currentMarker.setTitle(station.name);
      this.currentMarker.setPosition(station.location);
      this.currentMarker.setVisible(true);
      this.currentMarker.showInfoWindow();
      this.animateCamera(station.location);
    }
  }

  rmCurrentStation() {
    if (this.currentMarker) {
      this.currentStation = null;
      this.currentMarker.remove();
      this.currentMarker = null;
    }
  }

  viewStationDetail(station: Station) {
    this.navCtrl.push("BusinoBusstopDetailPage", { station: station });
  }
}
