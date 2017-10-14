
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

import { LatLng } from '@ionic-native/google-maps';

import { HttpService } from "../http-service";
import { ResponseCode, RequestState, LoginStatus } from '../app-constant';
import { Utils } from '../app-utils';
import { AppLoop } from '../app-loop';

import { BusinoHttpService } from "./busino-http-service";
import { BusinoConfig } from "./busino-config";

import { BusinoData } from './controller/busino-data';
import { BusController } from './controller/bus-controller';
import { BusLocationController } from './controller/bus-location-controller';

// import { BusRouteController } from './controller/bus-route-controller';
import { AppDataController } from './controller/app-data-controller';
// import { SimuBusController } from './controller/simu-bus-controller';
// import { BusStopController } from './controller/bus-stop-controller';
// import { SearchPathController } from './controller/search-path-controller';

@Injectable()
export class BusinoModule {
  private mBusinoHttpService: BusinoHttpService;

  private mConfig: BusinoConfig;

  private mBusData: BusinoData;

  private mBusController: BusController;

  private mBusLocationController: BusLocationController;

  currentVersion: string = "";

  mAnimationFrameID: number = -1;

  mAnimationFrameRunning: boolean = false;

  private mAppDataController: AppDataController;

  constructor(private mHttpService: HttpService) {

    this.mBusinoHttpService = new BusinoHttpService(mHttpService);

    this.mConfig = new BusinoConfig();

    this.mBusData = new BusinoData();

    AppLoop.getInstance().scheduleUpdate(this);

    this.mBusController = new BusController();

    this.mBusLocationController = new BusLocationController(this.mBusinoHttpService);

    this.mAppDataController = new AppDataController(mHttpService);
  }
  start() {
    this.scheduleUpdate();
    this.testRequest();
    this.doLoadAppData();
  }
  scheduleUpdate() {
    this.mAnimationFrameRunning = true;
    this.mAnimationFrameID = requestAnimationFrame(() => {
      // this.onUpdate();
      if (this.mAnimationFrameRunning) this.scheduleUpdate();
    });
  }

  unScheduleUpdate() {
    cancelAnimationFrame(this.mAnimationFrameID);
    this.mAnimationFrameRunning = false;
  }


  /**===================Get Functions=================== */
  getHttpService() {
    return this.mBusinoHttpService;
  }
  getAppConfig() {
    return this.mConfig;
  }
  getBusController() {
    return this.mBusController;
  }
  loadConfig() {
    return new Promise((resolve, reject) => {
      if (this.mBusData.mRoutes.size > 0) {
        resolve();
        return;
      } else {
        this.mHttpService.getHttp().request("assets/config/busino.json").subscribe(
          data => {
            this.onLoadedConfig(data.json());
            this.mHttpService.getHttp().request("assets/config/busdata.json").subscribe(
              data => {
                this.onLoadedBusData(data.json().routes)
                resolve();
              }
            );
          }
        );
      }
    });
  }

  getBusData() {
    return this.mBusData;
  }

  getBusRoutes() {
    return this.mBusData.getRoutes();
  }

  getRouteByCode(code: string) {
    return this.mBusData.getRouteByCode(code);
  }

  getBusStations() {
    return this.mBusData.getStations();
  }

  getStationsAround(location: LatLng){
    return this.mBusData.getStationsAround(location);
  }

  onLoadedBusData(data) {
    this.mBusData.onResponse(data);
    this.mBusData.mRoutes.forEach(route => {
      this.mBusController.createBusRoute(route);
    });
    this.mBusController.setLocationController(this.mBusLocationController);
    this.mBusController.startMove();
  }
  onLoadedConfig(data) {
    this.mConfig.onResponseConfig(data);
    this.getHttpService().onLoadedConfig(data.connection_config);
  }
  onUpdate() {
    this.mBusController.onUpdate();
    this.mBusLocationController.onUpdate();
  }
  /**============================================== */


  testRequest() {
      this.mBusinoHttpService.testRequest();
  }



  doLoadAppData() {
    if (this.mAppDataController.ready()) return;
    if (this.mAppDataController.getRequestState() == RequestState.REQUESTING) return;
    this.mAppDataController.setRequestState(RequestState.REQUESTING);
    this.getHttpService().RequestAppData().then((data) => {
      this.onLoadAppData(data).then((res) => {
        console.log("doLoadAppData", this.mBusData);

      }, (rej) => {
        this.loadConfig();
      });
    }, (error)=>{
      console.log("RequestAppData Error", error);
      this.loadConfig();
      
    });
  }

  onLoadAppData(data) {
    return new Promise(
      (resolve, reject) => {
        let lastestVersion: string = data.last_bus_data_version;
        let url: string = data.link_download_bus_data;

        if (data) {
          if (this.currentVersion != data.last_bus_data_version) {
            this.requestAppData(url).then(res => {
              this.onLoadedBusData(res)
              resolve();
            }, rej => {
              reject();
            });
          }
          else {
            console.log("Current Data is lastest");
            reject();
          }

        }
        else {
          reject();
        }
      }
    )
  }

  requestAppData(url: string) {
    return new Promise((resolve, reject) => {
      this.mHttpService.getHttp().get(url).subscribe((data) => {
        resolve(data.json());
      }, (error) => {
        console.log(error);
        reject();
      });
    });
  }

  getAppData() {
    return this.mAppDataController.getAppData();
  }


  requestAddress(data: LatLng) {
    return new Promise((resolve, reject) => {
      if (data) {
        let url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + data.lat + "," + data.lng + "&sensor=false"

        this.mHttpService.getHttp().get(url).subscribe(data => {
          let addr = this.onResponseAddress(data.json());
          resolve(addr);
        })
      }
      else {
        reject();
      }
    })
  }

  onResponseAddress(data) {
    return data['results'][0].formatted_address;

    // return this.mAppDataController.onResponseAddress(data).then(data => {

    //   console.log("address data", data);

    //   this.setCurrentAddress();
    // });
  }
}