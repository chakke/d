import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, MenuController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { AppInterface, ResponseCode } from '../../providers/app-constant';
import { DeviceInfoProvider } from '../../providers/device-info/device-info';
import { Device } from "@ionic-native/device";
import { StatusBar } from '@ionic-native/status-bar';

import { BusinoModule } from '../../providers/busino/busino';

@IonicPage()
@Component({
  selector: 'page-busino-loading',
  templateUrl: 'busino-loading.html',
})
export class BusinoLoadingPage {
  app: AppInterface;
  constructor(
    private storage: Storage,
    private device: Device,
    private mPlatform: Platform,
    private mDeviceInfoProvider: DeviceInfoProvider,
    private navParams: NavParams,
    private navCtrl: NavController,
    private mBusinoModule: BusinoModule,
    public mStatusBar: StatusBar,
    private mMenuController: MenuController) {

    this.app = this.navParams.get('app');
    this.mPlatform.ready().then(() => {
      this.onPlatformReady();
    });

  }

  ionViewDidEnter() {
  }

  onPlatformReady() {
    this.mStatusBar.backgroundColorByHexString("#46ACEE");
    this.mStatusBar.overlaysWebView(false);
    this.doCheckNetwork().then(
      data => { this.onHasNetwork(); },
      error => { }
    );
  }
  doCheckNetwork() {
    return new Promise((success, fail) => {
      success();
    });
  }
  onHasNetwork() {
    this.getDeviceInfos();
    this.mBusinoModule.start();
    this.doSwitchPage();
  }
  getDeviceInfos() {
    this.mDeviceInfoProvider.mUserDevice.createDefault();
    if (this.device.uuid != null) {
      this.mDeviceInfoProvider.mUserDevice.cordova = this.device.cordova;
      this.mDeviceInfoProvider.mUserDevice.manufacture = this.device.manufacturer;
      this.mDeviceInfoProvider.mUserDevice.model = this.device.model;
      this.mDeviceInfoProvider.mUserDevice.platform = this.device.platform;
      this.mDeviceInfoProvider.mUserDevice.serial = this.device.serial;
      this.mDeviceInfoProvider.mUserDevice.uuid = this.device.uuid;
      this.mDeviceInfoProvider.mUserDevice.version = this.device.version;
    }
  }

  doSwitchPage() {
    setTimeout(() => {
      this.navCtrl.setRoot("BusinoHomePage");
    }, 2000);
  }

}
