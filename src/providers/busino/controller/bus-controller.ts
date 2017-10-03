import { Route } from '../classes/route';
import { Bus } from '../classes/bus';
import { BusLocationController } from './bus-location-controller';

import { LatLng } from '@ionic-native/google-maps';


export class BusRoute {
    mRoute: Route;
    mBuses: Array<Bus> = [];
    mPoints: Array<LatLng> = [];
    mGoLength: number = 0;
    mRunning: boolean = false;
    mViewType: number = -1;
    mMaxBusForRoute: number = 30;
    constructor(route: Route) {
        this.mRoute = route;

        for (let point of this.mRoute.mGoWaypoint.geo) {
            this.mPoints.push(point);
        }
        this.mGoLength = this.mPoints.length;

        for (let point of this.mRoute.mReturnWaypoint.geo) {
            this.mPoints.push(point);
        }
        this.createBus();
    }

    mLocationController: BusLocationController;

    setLocationController(locationController: BusLocationController) {
        this.mLocationController = locationController;

    }
    createBus() {

        if (this.mBuses.length > 0) return;
        while (this.mBuses.length < this.mMaxBusForRoute) {
            let bus = new Bus();
            bus.mCode = "" + this.mRoute.getCode() + "-00" + (this.mBuses.length);
            let stationIndex: number = this.mBuses.length * Math.floor(this.mPoints.length / (this.mMaxBusForRoute + 1));
            bus.setStationIndex(stationIndex);
            bus.setLocation(this.mPoints[stationIndex]);
            if (stationIndex + 1 >= this.mPoints.length) stationIndex = -1;
            bus.setTarget(this.mPoints[stationIndex + 1]);

            this.mBuses.push(bus);
        }
    }

    startMove() {
        if (this.mRunning) return;
        this.mRunning = true;
        let index = 0;
        for (let bus of this.mBuses) {
            let stationIndex: number = index * Math.floor(this.mPoints.length / (this.mMaxBusForRoute + 1));
            index++;
            bus.setLocation(this.mPoints[stationIndex]);
            stationIndex = stationIndex + 1;
            if (stationIndex >= this.mPoints.length) stationIndex = 0;
            bus.setStationIndex(stationIndex);
            bus.setTarget(this.mPoints[stationIndex]);
        }
    }


    onUpdate() {
        if (!this.mRunning) return;
        for (let bus of this.mBuses) {
            bus.onUpdate();
            if (bus.hasMoveDone()) {
                let nextStationIndex = bus.mStationIndex + 1;
                if (nextStationIndex >= this.mPoints.length) nextStationIndex = 0;
                bus.setStationIndex(nextStationIndex);
                bus.setTarget(this.mPoints[nextStationIndex]);
            }

            if (this.mViewType == 0) {
                bus.setMarkerVisible(true);
            } else {
                bus.setMarkerVisible((1 + Math.floor(bus.mStationIndex / this.mGoLength)) == this.mViewType);
            }
        }
    }
    synchronizeBusLocation() {
        this.mBuses.forEach(bus => {
            this.mLocationController.addRequest(this.mRoute.getCode(), bus.mCode, bus.mCurrentLocation.lat, bus.mCurrentLocation.lng, (bus.mStationIndex <= this.mGoLength) ? 0 : 1);
        });
    }
    setViewType(viewType: number) {
        this.mViewType = viewType;
    }


}

export class BusController {

    mBusRoutes: Map<string, BusRoute> = new Map<string, BusRoute>();

    mStep: number = 100;

    mCount: number = 0;

    mUpdateLocationStep: number = 3000;

    mUpdateLocationTime: number = 0;

    constructor() {

    }
    setLocationController(controller: BusLocationController) {

        this.mBusRoutes.forEach(busRoute => {
            busRoute.setLocationController(controller);
        });
    }

    getBusRoute(code: string) {
        if (this.mBusRoutes.has(code)) return this.mBusRoutes.get(code);
        return null;
    }
    createBusRoute(route: Route) {
        if (!this.getBusRoute(route.getCode())) {
            let busRoute = new BusRoute(route);
            this.mBusRoutes.set(route.getCode(), busRoute);
        }
    }
    onUpdate() {
        this.updateMovement();
        this.synchronizeLocation();
    }

    updateMovement() {
        this.mCount++;
        if (this.mCount < this.mStep) return;
        this.mCount = 0;
        this.mBusRoutes.forEach(busRoute => {
            busRoute.onUpdate();
        });
    }
    synchronizeLocation() {
        this.mUpdateLocationTime++;
        if (this.mUpdateLocationTime < this.mUpdateLocationStep) return;
        this.mUpdateLocationTime = 0;
        this.mBusRoutes.forEach(busRoute => {
            busRoute.synchronizeBusLocation();
        });
    }
    startMove() {
        this.mBusRoutes.forEach(busRoute => {
            busRoute.startMove();
        })
    }

}