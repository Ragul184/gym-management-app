import { Gender } from '../model/gender';
export class User {
    id?: string;
    memberId?: string;
    memberName?: string;
    address?: string;
    gender?: Gender;
    gymName: string;
    feesPaid?: boolean | string;
    subscriptionEndDt?: Date | any;
    joiningDt: Date | any;
    birthDt: Date | any;
    phoneNumber: string;
    age: number;
    active: boolean;
}
