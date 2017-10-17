import { LatLng, Marker } from '@ionic-native/google-maps';

export class Location {
    name: string = "";
    latlng: LatLng;
    marker: Marker;

    constructor(){
        this.resetData();
    }

    onResponseData(name: string, latlng: LatLng){
        this.resetData();
        this.name = name;
        this.latlng = latlng;
    }

    resetData(){
        this.name = "";
        this.latlng = null;
        if(this.marker){
            this.marker.remove();
            this.marker = null;
        }
    }

    setMarker(marker: Marker){
        this.marker = marker;
    }

    getMarker(){
        if(this.marker){
            return this.marker;
        }
    }
}