import { HttpService } from '../../http-service';
import { AppData } from '../classes/app-data';

import { RequestState } from '../../app-constant';

export class AppDataController {
    mAppData: AppData = new AppData();

    private mReady: boolean = false;

    private mRequestState: RequestState = RequestState.READY;

    currentVersion: string = '';

    constructor(public mHttpService: HttpService) {

    }

    ready() {
        return this.mReady;
    }

    setRequestState(newState: RequestState) {
        this.mRequestState = newState;
    }

    getRequestState() {
        return this.mRequestState;
    }

    onResponseData(data) {
        return new Promise(
            (resolve, reject) => {
                let lastestVersion: string = data.last_bus_data_version;
                let url: string = data.link_download_bus_data;

                if (data) {
                    if (this.currentVersion != data.last_bus_data_version) {
                        this.requestAppData(url).then(res => {
                            resolve();
                        }, rej => {
                            reject();
                        });
                    }
                    else {
                        console.log("Current Data is lastest");
                        reject();
                    }

                }
                else {
                    reject();
                }
            }
        )
    }

    requestAppData(url: string) {
        return new Promise((resolve, reject) => {
            this.mHttpService.getHttp().get(url).subscribe((data) => {
                this.mAppData.onResponseData(data.json()).then((res) => {
                    console.log(res);

                    // this.onResponseSearchData(this.mAppData.data);
                    resolve();
                }, (rej) => {
                    reject();
                });
            }, (error) => {
                console.log(error);
                reject();
            });
        });
    }

    getAppData() {
        return this.mAppData;
    }
}