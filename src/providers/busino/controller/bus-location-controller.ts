import { BusinoHttpService } from '../busino-http-service';


export interface RequestData {
    route_code: string;
    bus_code: string;
    lat: number;
    lng: number;
    direct_type: number;
}

export class BusLocationController {


    mRequests: Array<RequestData> = [];
    mHttpService: BusinoHttpService;

    constructor(httpService: BusinoHttpService) {
        this.mHttpService = httpService;
    }

    addRequest(route_code: string, bus_code: string, lat: number, lng: number, direct_type: number) {
        this.mRequests.push({
            route_code: route_code,
            bus_code: bus_code,
            lat: lat,
            lng: lng,
            direct_type: direct_type,
        });
    }
    mStep: number = 10;
    mCount: number = 0;
    onUpdate() {
        this.mCount++;
        if (this.mCount < this.mStep) return;
        this.mCount = 0;
        
        if (this.mRequests.length == 0) return;

        let requestData: RequestData = this.mRequests.shift();

        this.mHttpService.RequestBustUpdateLocation(requestData.route_code, requestData.bus_code, requestData.lat, requestData.lng, requestData.direct_type);
    }

}