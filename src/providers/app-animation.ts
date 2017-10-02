export class AppAnimation {

    private static _instance: AppAnimation = null;

    private constructor() {

    }

    public static getInstance() {
        if (this._instance == null) this._instance = new AppAnimation();
        return this._instance;
    }

    public animate(element: HTMLElement, animation: string, duration: string, opacity?: number, removeClass?: string) {
        return new Promise(
            (resolve, reject) => {
                if (!element) {
                    reject();
                } else {
                    if (opacity) element.style.opacity = opacity + '';
                    element.style.animationDuration = duration;
                    if (removeClass)
                        element.classList.remove(removeClass);
                    element.classList.add(animation);
                    element.addEventListener("animationend", () => {
                        element.classList.remove(animation);
                        element.removeEventListener("animationend");
                        resolve();
                    });
                }
            });
    }

}