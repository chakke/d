
import { ParamBuilder, HttpService } from "../http-service";
import { Headers } from '@angular/http';
import { BusinoParamsKey } from './busino-paramskey';
import { BusinoCmd } from './busino-cmd';
import { Md5 } from 'ts-md5/dist/md5';

export class BusinoHttpService {
  private SERVICE_URL: string = "http://125.212.192.94:8080/busino_app/ws/";
  private CLIENT_KEY: string = "8c24516c23b611420defccf253598412";
  private DEVICE_ID: string = "appinasia_macbookpro";
  mHeaderWithKey: Headers;
  mHeader: Headers;
  mHttpService: HttpService;
  constructor(private httpService: HttpService) {
    this.mHttpService = httpService;
    this.createHeaders();
  }
  onLoadedConfig(data) {
    this.SERVICE_URL = data.service_url;
    this.CLIENT_KEY = data.client_key;
    this.DEVICE_ID = data.device_id;
  }
  setDeviceID(deviceID: string) {
    this.DEVICE_ID = deviceID;
  }
  createHeaders() {

    if (this.mHeaderWithKey == null || this.mHeaderWithKey == undefined) {
      this.mHeaderWithKey = new Headers();
      this.mHeaderWithKey.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
      this.mHeaderWithKey.append('device_id', this.DEVICE_ID);
    }
    if (this.mHeader == null || this.mHeader == undefined) {
      this.mHeader = new Headers();
      this.mHeader.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    }
  }
  requestGet(url: string, params: string) {
    return this.mHttpService.requestGet(url, params, { headers: this.mHeaderWithKey });
  }

  requestPost(url: string, params: string) {
    return this.mHttpService.requestPost(url, params, { headers: this.mHeaderWithKey });
  }
  get(url: string, params: string) {
    return this.mHttpService.requestGet(url, params, { headers: this.mHeader });
  }
  post(url: string, params: string) {
    return this.mHttpService.requestPost(url, params, { headers: this.mHeader });
  }

  testRequest() {
    // console.log("2.1");
    // this.RequestBusPickup('21.027764', '105.834160');
    // console.log("2.2");
    // this.RequestBusAround('21.027764', '105.834160');
    // console.log("2.5");
    // this.RequestBusStopAround('21.027764', '105.834160');
    // console.log("2.9");
    // this.RequestBusRouteSearch("cau");

    ///////////////////////////

    // console.log("2.3");
    // this.RequestBusComing("3", "4", 0);
    console.log("2.4");
    this.RequestBusSearchPath("21.027764", "105.834160", "21.038559", "105.847124");
    console.log("2.6");
    this.RequestBusStopInfo("3");
    // console.log("2.7");
    // this.RequestBusStopSearch("cau");
    // console.log("2.8");
    // this.RequestBusRouteInfo("23");
    // console.log("2.10");
    // this.RequestBusRouteList("0-10");
    // console.log("2.11");
    // this.RequestBusRouteListBus("3");
    console.log("2.12");
    this.RequestAppData();
  }

  /**Request 2.1  Pick up*/
  RequestBusPickup(lat: string, lng: string) {
    return this.requestGet(this.SERVICE_URL + BusinoCmd.PICK_UP, ParamBuilder.builder()
      .add(BusinoParamsKey.LAT, lat)
      .add(BusinoParamsKey.LNG, lng)
      .add(BusinoParamsKey.SIGN, Md5.hashStr(lat + "" + lng + "" + this.CLIENT_KEY))
      .build());
  }

  /**Request 2.2  Danh sách xe bus xung quanh một toạ độ*/
  RequestBusAround(lat: string, lng: string) {
    return this.requestGet(this.SERVICE_URL + BusinoCmd.BUS_AROUND, ParamBuilder.builder()
      .add(BusinoParamsKey.LAT, lat)
      .add(BusinoParamsKey.LNG, lng)
      .add(BusinoParamsKey.SIGN, Md5.hashStr(lat + "" + lng + "" + this.CLIENT_KEY))
      .build());
  }

  /**Request 2.3  Xe bus đang đến một điểm dừng*/
  RequestBusComing(route_code: string, bus_stop_code: string, route_type: number) {
    return this.requestGet(this.SERVICE_URL + BusinoCmd.BUS_COMING, ParamBuilder.builder()
      .add(BusinoParamsKey.ROUTE_CODE, route_code)
      .add(BusinoParamsKey.BUS_STOP_CODE, bus_stop_code)
      .add(BusinoParamsKey.ROUTE_TYPE, route_type)
      .add(BusinoParamsKey.SIGN, Md5.hashStr(route_code + bus_stop_code + route_type + this.CLIENT_KEY))
      .build());
  }

  /**Request 2.4  Tìm kiếm đường đi*/
  RequestBusSearchPath(pickup_lat: string, pickup_lng: string, des_lat: string, des_lng: string) {
    return this.requestGet(this.SERVICE_URL + BusinoCmd.SEARCH_PATH, ParamBuilder.builder()
      .add(BusinoParamsKey.PICKUP_LAT, pickup_lat)
      .add(BusinoParamsKey.PICKUP_LNG, pickup_lng)
      .add(BusinoParamsKey.DES_LAT, des_lat)
      .add(BusinoParamsKey.DES_LNG, des_lng)
      .add(BusinoParamsKey.SIGN, Md5.hashStr(pickup_lat + des_lat + "" + this.CLIENT_KEY))
      .build());
  }

  /**Request 2.5  Truy vấn điểm dừng xe bus xung quanh một vị trí*/
  RequestBusStopAround(lat: string, lng: string) {
    return this.requestGet(this.SERVICE_URL + BusinoCmd.BS_AROUND, ParamBuilder.builder()
      .add(BusinoParamsKey.LAT, lat)
      .add(BusinoParamsKey.LNG, lng)
      .add(BusinoParamsKey.SIGN, Md5.hashStr(lat + "" + lng + "" + this.CLIENT_KEY))
      .build());
  }

  /**Request 2.6  Thông tin điểm dừng xe bus*/
  RequestBusStopInfo(code: string) {
    return this.requestGet(this.SERVICE_URL + BusinoCmd.BS_INFO, ParamBuilder.builder()
      .add(BusinoParamsKey.CODE, code)
      .add(BusinoParamsKey.SIGN, Md5.hashStr(code + this.CLIENT_KEY))
      .build());
  }

  /**Request 2.7  Tìm kiếm điểm dừng xe bus*/
  RequestBusStopSearch(keyword: string) {
    return this.requestGet(this.SERVICE_URL + BusinoCmd.BS_SEARCH, ParamBuilder.builder()
      .add(BusinoParamsKey.KEYWORD, keyword)
      .build());
  }

  /**Request 2.8  Thông tin của tuyến xe*/
  RequestBusRouteInfo(code: string) {
    return this.requestGet(this.SERVICE_URL + BusinoCmd.BR_INFO, ParamBuilder.builder()
      .add(BusinoParamsKey.CODE, code)
      .add(BusinoParamsKey.SIGN, Md5.hashStr(code + this.CLIENT_KEY))
      .build());
  }

  /**Request 2.9  Tìm kiếm tuyến xe bus*/
  RequestBusRouteSearch(keyword: string) {

  }

  /**Request 2.10 Danh sách tuyến xe bus*/
  RequestBusRouteList(range: string) {
    return this.requestGet(this.SERVICE_URL + BusinoCmd.BR_LIST, ParamBuilder.builder()
      .add(BusinoParamsKey.RANGE, range)
      .build());
  }

  /**Request 2.11 Danh sách các xe bus đang hoạt động của tuyến*/
  RequestBusRouteListBus(code: string) {
    return this.requestGet(this.SERVICE_URL + BusinoCmd.BR_LIST_BUS, ParamBuilder.builder()
      .add(BusinoParamsKey.CODE, code)
      .add(BusinoParamsKey.SIGN, Md5.hashStr(code + this.CLIENT_KEY))
      .build());
  }

  /**Request 2.12 Danh sách các xe bus đang hoạt động của tuyến*/
  RequestAppData() {
    return this.requestGet(this.SERVICE_URL + BusinoCmd.APP_DATA, ParamBuilder.builder()
      .build());
  }

  RequestBustUpdateLocation(routeCode: string, bks: string, lat: number, lng: number, direct_type: number) {
    return this.requestGet("http://125.212.192.94:3000/" + BusinoCmd.BUS_UPDATE_LOCATION, ParamBuilder.builder()
    .add(BusinoParamsKey.ROUTE_CODE, routeCode)
    .add(BusinoParamsKey.BKS, bks)
    .add(BusinoParamsKey.LAT, lat)
    .add(BusinoParamsKey.LNG, lng)
    .add(BusinoParamsKey.DIRECT_TYPE, direct_type)
    .build());
  }
}
