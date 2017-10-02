export class AppModule {

    private static _instance: AppModule = null;

    private constructor() {

    }

    public static getInstance() {
        if (this._instance == null) {
            this._instance = new AppModule();
        }
        return this._instance;
    }

}