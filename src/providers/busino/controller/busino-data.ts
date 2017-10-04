import { Route } from '../classes/route';
import { Station } from '../classes/station';
export class BusinoData {
    mRoutes: Map<string, Route> = new Map<string, Route>();
    mStations: Map<number, Station> = new Map<number, Station>();

    constructor() {

    }

    getRoutes(){
        return this.mRoutes;
    }

    getStations(){
        return this.mStations;
    }

    getRouteByCode(code: string): Route {
        if (this.mRoutes.has(code)) return this.mRoutes.get(code);
        return null;
    }

    getStationById(id: number): Station {
        if (this.mStations.has(id)) return this.mStations.get(id);
        return null;
    }

    onResponse(data) {        
        this.mRoutes.clear();
        this.mStations.clear();
        for (let routeData of data) {
            let route = new Route();
            route.onResponse(routeData);
            if (!this.getRouteByCode(route.getCode())) {
                this.mRoutes.set(route.getCode(), route);
                for (let station of route.mGoWaypoint.stations) {
                    if (!this.mStations.has(station.getID())) {
                        this.mStations.set(station.getID(), station);
                    }
                }
            }

        }
    }

}