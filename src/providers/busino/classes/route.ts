import { WayPoint } from './waypoint';
import { Utils } from '../../app-utils';

export class Route {
    mGoWaypoint: WayPoint = new WayPoint();
    mReturnWaypoint: WayPoint = new WayPoint();
    mOperationsTime: string = "";
    mFleedId: number = -1;
    mBusCount: string = "";
    mEnterprise: string = "";
    mFrequency: string = "";
    mCode: string = "";
    mCost: string = "";
    mName: string = "";
    search: string = "";

    constructor() {

    }
    onResponse(data) {
        if (!data) return;
        this.mFleedId = data.FleetID;
        this.mBusCount = data.BusCount;
        this.mEnterprise = data.Enterprise;
        this.mFrequency = data.Frequency;
        this.mCode = data.Code;
        this.mCost = data.Cost;
        this.mName = data.Name;
        this.mOperationsTime = data.OperationsTime;
        this.mGoWaypoint.onResponse(data.Go);
        this.mReturnWaypoint.onResponse(data.Re);
        this.onSetUpSearchData();
    }
    getCode() {
        return this.mCode;
    }

    onSetUpSearchData() {
        let en: string = Utils.bodauTiengViet(this.mName + " " + this.mGoWaypoint.getRouteDetail() + " " + this.mReturnWaypoint.getRouteDetail());
        this.search = "tuyen " + this.mCode + " #tuyen" + this.mCode + " " + en;
        let words = en.split(" ");
        if (words.length > 1) {
            this.search += " ";
            for (let word of words) {
                if (word.length > 0) {
                    this.search += word.charAt(0);
                }
            }
        }
        // this.search += " " + this.content;
    }
}