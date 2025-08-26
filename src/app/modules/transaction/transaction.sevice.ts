import { Types } from "mongoose";
import { Transaction } from "./transaction.model";

const getAllTransactions = async (query: Record<string, string>) => {
    const transactions = await Transaction.find(query)
        .populate("sender", "name email phone")
        .populate("receiver", "name email phone")
        .sort({ createdAt: -1 });

    const totalTransactions = await Transaction.countDocuments(query);

    return {
        data:transactions,
        meta:{
            total:totalTransactions
        }
    }
}

const getMyTransactions = async (userId: string) => {
    const myTransactions = await Transaction.find({
        $or: [
            { sender: new Types.ObjectId(userId) },
            { receiver: new Types.ObjectId(userId) }
        ]
    })
        .populate("sender", "name email phone")
        .populate("receiver", "name email phone")
        .sort({ createdAt: -1 });

    return myTransactions
}

export const transactionServices = {
    getAllTransactions,
    getMyTransactions
} 