import { Types } from "mongoose";
import { Transaction } from "./transaction.model";

const getAllTransactions = async () => {
    const transactions = await Transaction.find({})
        .populate("sender", "name email phone")
        .populate("receiver", "name email phone")
        .sort({ createdAt: -1 });

    return transactions
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