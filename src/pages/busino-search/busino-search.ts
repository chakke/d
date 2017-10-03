import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';

import { Utils } from '../../providers/app-utils';

@IonicPage()
@Component({
  selector: 'page-busino-search',
  templateUrl: 'busino-search.html',
})
export class BusinoSearchPage {
  @ViewChild("mSearchBar") mSearchbar: Searchbar;

  // header contributes
  title = "Tra cứu";
  root = "BusinoHomePage";
  segments = ["Tuyến buýt", "Điểm dừng"];
  bgcolor = "#FDC21E";
  color = "white";

  // searchbar contributes
  mSearchInput: string = "";
  mPlaceholder: string = "";
  mShouldShowCancel: boolean = false;
  isSearching: boolean = false;

  // -------------------
  currentView: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinoSearchPage');
  }

  onChangeView(view) {
    this.currentView = view;
    console.log("View: " + this.currentView);
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
      // if (this.currentView == this.BUSROUTE) {
      //   this.currentBrData = this.mSearchData.filter(elm => {
      //     return (elm.search.indexOf(query) !== -1) || (elm.search.indexOf(Utils.bodauTiengViet(query)) !== -1);
      //   })
      // }
      // else {
      //   this.currentBsData = this.mBusStopData.filter(elm => {
      //     return (elm.search.indexOf(query) !== -1) || (elm.search.indexOf(Utils.bodauTiengViet(query)) !== -1);
      //   })
      // }
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
    // this.currentBsData = this.mBusStopData;
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
