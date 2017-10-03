import { WayPoint } from './waypoint';

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
    }
    getCode() {
        return this.mCode;
    }
}