import { Types } from "mongoose";

export enum Role {
     USER = "user",
     AGENT = "agent",
     ADMIN = "admin",
     SUPER_ADMIN = 'super_admin'
}

export interface IUser {
     _id?: Types.ObjectId,
     name: string,
     email: string,
     phone?: string,
     password: string,
     role: Role,
     wallet?: Types.ObjectId,
     transactions?: Types.ObjectId[],
     isBlocked: boolean,
     isApproved: boolean,
}