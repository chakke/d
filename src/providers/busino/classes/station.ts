import { LatLng, Marker } from '@ionic-native/google-maps';
import { Utils } from '../../app-utils';

export class Station {

    location: LatLng = new LatLng(0, 0);
    id: number = -1;
    code: string = "";
    fleetOver: string = "";
    routes: Array<string> = [];
    name: string = "";
    marker: Marker;
    search: string = "";

    constructor() {
        this.reset();
    }
    reset() {
        this.location = new LatLng(0, 0);
        this.id = -1;
        this.code = "";
        this.fleetOver = "";
        this.routes = [];
        this.name = "";
        this.search = "";
        this.marker = null;
    }

    onResponse(data) {
        this.location = new LatLng(data.Geo.Lat, data.Geo.Lng);
        this.id = data.ObjectID;
        this.code = data.Code;

        this.name = data.Name;
        this.fleetOver = data.FleetOver;

        let codes: string = data.FleetOver;
        let _codes = codes.split(",");
        for (let code of _codes) {
            this.routes.push(code);
        }
        this.onSetUpSearchData();
    }

    getID() {
        return this.id;
    }

    setMarker(marker: Marker){
        this.marker = marker;
    }

    getMarker(){
        return this.marker;
    }

    onSetUpSearchData(){
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