import { Types } from "mongoose";

export enum TransactionType {
    SEND_MONEY = "send_money",
    ADD_MONEY = "add_money",
    CASH_OUT = "cash_out",
    CASH_IN = "cash_in",
    REVERSAL = "reversal",
}

export enum TransactionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    REVERSED = "reversed",
}

export interface ITransaction {
    _id?: Types.ObjectId;

    sender?: Types.ObjectId;
    receiver?: Types.ObjectId;

    amount: number;

    type: TransactionType;
    status: TransactionStatus;

    approvedBy?: Types.ObjectId;
    requestedBy?: Types.ObjectId;


}
