import { Station } from './station';
import { LatLng } from '@ionic-native/google-maps';

export class WayPoint {
    geo: Array<LatLng> = [];
    stations: Array<Station> = [];
    route_detail: string = "";
    constructor() {
        this.reset();
    }

    reset() {
        this.geo = [];
        this.stations = [];
        this.route_detail = "";
    }

    onResponse(data) {
        if (!data) return;
        this.reset();
        data.Geo.forEach(latlng => {
            let tempLatLng: LatLng = new LatLng(latlng.Lat, latlng.Lng);
            this.geo.push(tempLatLng);
        });
        for (let stationData of data.Station) {
            let station = new Station();
            station.onResponse(stationData);
            this.stations.push(station);
        }
        this.route_detail = data.route;
    }

}