import { Utils } from '../../app-utils';
import { LatLng } from '@ionic-native/google-maps';

export class AppData {
    busRoutes: Array<BusRoute> = [];
    busStops: Array<Station> = [];
    constructor() {

    }

    onResponseData(data) {
        return new Promise((resolve, reject) => {
            if (data) {
                for (let i = 0; i < data.length; i++) {

                    let busRoute = new BusRoute(data[i]);

                    this.busRoutes.push(busRoute);

                    // this.onResponseBusStop(busRouteJsonItem)
                }
                resolve(this.busRoutes);
            }
            else {
                reject();
            }
        });
    }
}

export class BusRoute {
    busCount: string = "";
    code: string = "";
    cost: string = "";
    enterprise: string = "";
    fleedId: number = -1;
    frequency: string = "";
    name: string = "";
    operationsTime: string = "";
    go: BusRouteDetail;
    re: BusRouteDetail;
    search: string;

    constructor(busRouteData) {
        this.onResponseData(busRouteData);
    }

    onResponseData(data) {
        this.busCount = data.BusCount;
        this.code = data.Code;
        this.cost = data.Cost;
        this.enterprise = data.Enterprise;
        this.fleedId = data.FleetID;
        this.frequency = data.Frequency;
        this.name = data.Name;
        this.operationsTime = data.OperationsTime;
        this.go = new BusRouteDetail(data.Go)
        this.re = new BusRouteDetail(data.Re)
        this.onSetUpSearchData();
    }

    onSetUpSearchData() {
        let en: string = Utils.bodauTiengViet(this.name + " " + this.go.route + " " + this.re.route);
        this.search = "tuyen " + this.code + " #tuyen" + this.code + " " + en;
        let words = en.split(" ");
        if (words.length > 1) {
            this.search += " ";
            for (let word of words) {
                if (word.length > 0) {
                    this.search += word.charAt(0);
                }
            }
        }
    }
}

export class BusRouteDetail {
    anomaly: number = -1;
    route: string = "";
    geo: Array<LatLng> = [];
    station: Array<Station> = [];

    constructor(busRouteDetail) {
        this.onResponseData(busRouteDetail);
    }

    onResponseData(data) {
        this.anomaly = data.Anomaly;
        this.route = data.Route;

        data.Geo.forEach(latlng => {
            let tempLatLng: LatLng = new LatLng(latlng.Lat, latlng.Lng);
            this.geo.push(tempLatLng);
        });

        data.Station.forEach(station => {
            let tempStation: Station = new Station(station);
            this.station.push(tempStation);
        });
    }
}

export class Station {
    code: string = "";
    fleetOver: string = "";
    name: string = "";
    objectID: string = "";
    geo: LatLng;
    search: string;

    constructor(stationData) {
        this.onResponseData(stationData);
    }

    onResponseData(data) {
        this.code = data.Code;
        this.fleetOver = data.FleetOver;
        this.name = data.Name;
        this.objectID = data.ObjectID;
        this.geo = new LatLng(data.Geo.Lat, data.Geo.Lng);
        this.onSetUpSearchData();
    }

    onSetUpSearchData() {
        let en: string = Utils.bodauTiengViet(this.name);
        this.search = this.fleetOver + " " + en;// + " " + this.code;
        let words = en.split(" ");
        if (words.length > 1) {
            this.search += " ";
            for (let word of words) {
                if (word.length > 0) {
                    this.search += word.charAt(0);
                }
            }
        }
    }
}