import { Utils } from '../../app-utils';

import { LatLng, Marker } from '@ionic-native/google-maps';

export class Bus {

    mCode: string;
    mRouteCode: string;
    mWayType: number = 1;
    mCurrentLocation: LatLng = new LatLng(0, 0);
    mTarget: LatLng = new LatLng(0, 0);
    mVelocity: LatLng = new LatLng(0, 0);
    mStationIndex: number = 1;
    mMoveDone: boolean = false;
    mMarker: Marker;
    mNextMarker: any;

    mSpeed: number = 0.0001;
    mSpeeds = [0.0001, 0.0003, 0.0001, 0.0004, 0.00014, 0.0002, 0.00025];
    mSpeedTime: number = 0;
    mSpeedStep: number = 5000;



    constructor() {


    }


    onUpdate() {
        this.move();
        this.updateMarker();
        this.updateSpeed();
    }
    updateSpeed() {
        if (this.mSpeedTime < this.mSpeedStep) return;
        this.mSpeedTime++;
        this.mSpeed = this.mSpeeds[Utils.randInt(0, this.mSpeeds.length - 1)];
    }
    setLocation(location: LatLng) {
        this.mCurrentLocation = location;
    }
    setTarget(target: LatLng) {
        this.mTarget = target;
    }
    setStationIndex(index: number) {
        this.mStationIndex = index;
    }

    private move() {
        this.mVelocity = new LatLng(this.mTarget.lat - this.mCurrentLocation.lat, this.mTarget.lng - this.mCurrentLocation.lng);

        if ((this.mVelocity.lat * this.mVelocity.lat + this.mVelocity.lng * this.mVelocity.lng) < this.mSpeed * this.mSpeed) {
            this.mMoveDone = true;
            this.mCurrentLocation = this.mTarget;
            this.mVelocity = new LatLng(0, 0);
        } else {
            this.mMoveDone = false;
            this.normalizeVelocity();
            this.scaleVelocity(this.mSpeed);
            this.mCurrentLocation = new LatLng(this.mCurrentLocation.lat + this.mVelocity.lat, this.mCurrentLocation.lng + this.mVelocity.lng);
            this.mVelocity = new LatLng(0,0);
        }
    }
    setMarkerVisible(visible: boolean) {
        if (this.mMarker) this.mMarker.setVisible(visible);
    }
    updateMarker() {
        if (this.mMarker) {
            this.mMarker.setPosition({
                lat: this.mCurrentLocation.lat,
                lng: this.mCurrentLocation.lng
            });
            // let rotation = this.calculateRotateDegree(this.mCurrentLocation.x, this.mCurrentLocation.y, this.mTarget.x, this.mTarget.y);
            // this.mMarker.set
        }

        if (this.mNextMarker) {
            this.mNextMarker.setPosition({
                lat: this.mTarget.lat,
                lng: this.mTarget.lng
            });
        }
    }
    calculateRotateDegree(lat1: number, lng1: number, lat2: number, lng2: number): number {
        if ((lat2 - lat1 >= 0) && (lng2 - lng1 >= 0))
            return this.radianToDegree(Math.asin((lng2 - lng1) / Math.sqrt(Math.pow((lat2 - lat1), 2) + Math.pow((lng2 - lng1), 2))));
        else if ((lng2 - lng1 >= 0) && (lat2 - lat1 <= 0)) {
            return 180 - this.radianToDegree(Math.asin((lng2 - lng1) / Math.sqrt(Math.pow((lat2 - lat1), 2) + Math.pow((lng2 - lng1), 2))));
        }
        else if ((lat2 - lat1 <= 0) && (lng2 - lng1 <= 0)) {
            return 180 + this.radianToDegree(Math.asin((lng1 - lng2) / Math.sqrt(Math.pow((lat2 - lat1), 2) + Math.pow((lng2 - lng1), 2))));
        }
        else if ((lng2 - lng1 <= 0) && (lat2 - lat1 >= 0)) {
            return 360 - this.radianToDegree(Math.asin((lng1 - lng2) / Math.sqrt(Math.pow((lat2 - lat1), 2) + Math.pow((lng2 - lng1), 2))));
        }
        return 0;
    }
    public radianToDegree(value) {
        return value * 180 / Math.PI;
    }
    hasMoveDone() {
        return this.mMoveDone;
    }

    // for convert from demo bot

    normalizeVelocity() {
        if (this.mVelocity.lat || this.mVelocity.lng) {
            let invLength: number = 1 / Math.sqrt(this.mVelocity.lat * this.mVelocity.lat + this.mVelocity.lng * this.mVelocity.lng);
            this.mVelocity.lat *= invLength;
            this.mVelocity.lng *= invLength;
        }
    }

    scaleVelocity(scale) {
        this.mVelocity.lat *= scale;
        this.mVelocity.lng *= scale;
    }
}