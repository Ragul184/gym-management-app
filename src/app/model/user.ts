import { Gender } from '../model/gender'
export class User {
    id?: string;
    name?: string;
    password?: string;
    emailId?: string;
    address?: string;
    gender?:Gender;
    feesPaid?: boolean;
    subscriptionEndDate?: Date;
    dateOfJoining:Date;
    dateOfBirth:Date;
    phoneNumber:string;
    age:number;
    active:boolean;
}