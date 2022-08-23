import { Gender } from '../model/gender';
export class User {
    memberId?: string;
    memberName?: string;
    email?: string;
    password?: string;
    address?: string;
    gender?: Gender;
    feesPaid?: boolean;
    subscriptionEndDt?: Date;
    joiningDt: Date;
    birthDt: Date;
    phoneNumber: string;
    age: number;
    active: boolean;
}
