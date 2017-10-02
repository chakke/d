
import { Injectable } from '@angular/core';
import { BusinoHttpService } from "./busino-http-service";
import { HttpService } from "../http-service";
import { ResponseCode, RequestState, LoginStatus } from '../app-constant';
import { Utils } from '../app-utils';
import { Storage } from "@ionic/storage";

// import { BusRouteController } from './controller/bus-route-controller';
import { AppDataController } from './controller/app-data-controller';
// import { SimuBusController } from './controller/simu-bus-controller';
// import { BusStopController } from './controller/bus-stop-controller';
// import { SearchPathController } from './controller/search-path-controller';

@Injectable()
export class BusinoModule {
  currentAddress: string = "";

  mAnimationFrameID: number = -1;

  mAnimationFrameRunning: boolean = false;

  mBusinoHttpService: BusinoHttpService;

  // mBusRouteController: BusRouteController;

  mAppDataController: AppDataController;
  // mSimuBusController: SimuBusController;
  // mBusStopController: BusStopController;
  // mSearchPathController: SearchPathController;

  constructor(
    private mStorage: Storage,
    private mHttpService: HttpService) {
    this.mBusinoHttpService = new BusinoHttpService(this.mHttpService);
    // this.mBusRouteController = new BusRouteController();
    this.mAppDataController = new AppDataController(this.mHttpService);
    // this.mSimuBusController = new SimuBusController(this.mAppDataController);
    // this.mBusStopController = new BusStopController(this.mAppDataController);
    // this.mSearchPathController = new SearchPathController();
  }
  start() {
    this.scheduleUpdate();
    this.testRequest();
    this.doLoadAppData();
  }
  scheduleUpdate() {
    this.mAnimationFrameRunning = true;
    this.mAnimationFrameID = requestAnimationFrame(() => {
      this.onUpdate();
      if (this.mAnimationFrameRunning) this.scheduleUpdate();
    });
  }

  unScheduleUpdate() {
    cancelAnimationFrame(this.mAnimationFrameID);
    this.mAnimationFrameRunning = false;
  }

  onUpdate() {

  }

  getHttpService() {
    return this.mBusinoHttpService;
  }

  testRequest() {
    this.mBusinoHttpService.testRequest();
  }

  doLoadBusRoute() {
    // if (this.mBusRouteController.ready()) return;
    // if (this.mBusRouteController.getRequestState() == RequestState.REQUESTING) return;
    // this.mBusRouteController.setRequestState(RequestState.REQUESTING);
    // this.getHttpService().RequestBusRouteList("0-90").then(
    //   (data) => {
    //     this.mBusRouteController.onResponseBusRoutes(data);
    //     this.mBusRouteController.setRequestState(RequestState.READY);
    //   }
    // );
  }

  getBusRoutes() {
    // return this.mBusRouteController.getBusRoutes();
  }

  doLoadAppData() {
    if (this.mAppDataController.ready()) return;
    if (this.mAppDataController.getRequestState() == RequestState.REQUESTING) return;
    this.mAppDataController.setRequestState(RequestState.REQUESTING);
    this.getHttpService().RequestAppData().then((data) => {
      this.mAppDataController.onResponseData(data).then(() => {
        // console.log(data);
        
        // this.mSimuBusController.onResponseData(this.getAppData().data)
      });
    });
  }

  getAppData() {
    return this.mAppDataController.getAppData();
  }

  getSimuBuses() {
    // return this.mSimuBusController.getSimuBuses();
  }

  getSimuBusesByRoute(code: string) {
    // return this.mSimuBusController.getSimuBusByRoute(code);
  }

  getSimuBusController() {
    // return this.mSimuBusController;
  }

  getBusStopController(){
    // return this.mBusStopController;
  }

  getSearchData() {
    // return this.mAppDataController.mSearchData;
  }

  getSearchHistory() {
    // return this.mAppDataController.getSearchHistory();
  }

  setSearchHistory(searchHistory: Array<string>) {
    // this.mAppDataController.setSearchHistory(searchHistory);
  }

  getBotSearchData(){
    // return this.mSimuBusController.getBotSearchData();
  }

  onResponseAddress(data) {
    // return this.mAppDataController.onResponseAddress(data).then(data => {

    //   console.log("address data", data);
      
    //   this.setCurrentAddress(data['results'][0].formatted_address);
    // });
  }

  setCurrentAddress(currentAddress: string) {
    this.currentAddress = currentAddress;
  }

  getCurrentAddress() {
    return this.currentAddress;
  }


  getBusStopData(){
    // return this.mBusStopController.getBusStopData();
  }

  getSearchPathController(){
    // return this.mSearchPathController;
  }

  getResultPath(){
    // return this.mSearchPathController.getResultPath();
  }

}