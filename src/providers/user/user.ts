
export enum UserState {
    ACTIVE,
    BLOCKED,
    BANNED
}

export enum LoginType {
    QUICK = 0,
    FACE_BOOK,
    GOOGLE,
    ZALO,
    PHONE,
    USERNAME_PASSWORD
}
export enum LoginStatus {
    LOGGED_IN = 0,
    LOGING,
    LOGGED_OUT
}

export class UserBase {
    mUsername: string;
    mName: string;
    mShortDes: string;
    mBirthDay: string;
    mSex: string;
    mAddress: string;
    mPhone: string;
    mAvatar: string;
    mCover: string;
    constructor() {
        this.default();
    }
    default() {
        this.mUsername = "";
        this.mName = "";
        this.mShortDes = "";
        this.mBirthDay = "1990-01-01";
        this.mSex = "";
        this.mAddress = "";
        this.mPhone = "";
        this.mAvatar = "";
        this.mCover = "";
    }

    getUsername(): string {
        return this.mUsername;
    }

    getName(): string {
        return this.mName;
    }
}

export class UserLevel {
    mLevel: number = 0;
    mProgress: number = 0;
    constructor() {

    }
}

export class UserMoney {
    money: number;
    gold: number;
    gem: number;
}

