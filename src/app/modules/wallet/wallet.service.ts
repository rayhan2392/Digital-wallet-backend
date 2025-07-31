import mongoose from "mongoose";
import AppError from "../../errorHelper/AppError";
import { Wallet } from "./wallet.model"
import httpStatus from "http-status-codes"
import { User } from "../user/user.model";
import { Transaction } from "../transaction/transaction.model";
import { TransactionStatus, TransactionType } from "../transaction/transaction.interface";

const getAllWallets = async () => {

    const wallets = await Wallet.find().populate("user", "name email role")

    return wallets
}

const getMyWallet = async (userId: string) => {
    const wallet = await Wallet.findOne({ user: userId })

    if (!wallet) {
        throw new AppError(404, "No wallet found for this user");
    }
    return wallet
}

const getWalletById = async (id: string) => {
    const wallet = await Wallet.findById(id).populate("user", "name")

    // if (!wallet) {
    //     throw new AppError(404, "No wallet found for this user");
    // }
    return wallet
}

const blockWallet = async (userId: string) => {
    const wallet = await Wallet.findOneAndUpdate({ user: userId })

    if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    }

    if (wallet.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wallet already blocked');
    }
    wallet.isBlocked = true;
    await wallet.save();

    return wallet;

}

const unBlockWallet = async (userId: string) => {
    const wallet = await Wallet.findOneAndUpdate({ user: userId })

    if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    }

    if (!wallet.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wallet already unblocked');
    }
    wallet.isBlocked = false;
    await wallet.save();

    return wallet;

}

const sendMoney = async (senderId: string, receiverPhone: string, amount: number) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        if (amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Amount must be greater than 0");
        }

        const sender = await User.findById(senderId).session(session);

        if (!sender) {
            throw new AppError(httpStatus.NOT_FOUND, "Sender not found");
        }

        const receiver = await User.findOne({ phone: receiverPhone }).session(session);

        if (!receiver) {
            throw new AppError(httpStatus.NOT_FOUND, "Receiver not found");
        }

        const senderWallet = await Wallet.findOne({ user: sender._id }).session(session);
        const receiverWallet = await Wallet.findOne({ user: receiver._id }).session(session);

        if (!senderWallet || !receiverWallet) {
            throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
        }

        if (senderWallet.isBlocked || receiverWallet.isBlocked) {
            throw new AppError(httpStatus.BAD_REQUEST, "Blocked wallet cannot perform operations");
        }

        if (senderWallet.balance < amount) {
            throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
        }

        // Update balances
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;

        await senderWallet.save({ session });
        await receiverWallet.save({ session });

        // Create transaction
        await Transaction.create([{
            sender: sender._id,
            receiver: receiver._id,
            amount,
            type: TransactionType.SEND_MONEY,
            status: TransactionStatus.COMPLETED
        }], { session });

        await session.commitTransaction();
        session.endSession();


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }



}

const cashInMoney = async (agentId: string, userPhone: string, amount: number) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        if (amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Amount must be greater than 0");
        }

        const agent = await User.findById(agentId).session(session);
        const user = await User.findOne({ phone: userPhone }).session(session);

        if (!agent || !user) {
            throw new AppError(httpStatus.NOT_FOUND, "Agent or user not found");
        }

        const agentWallet = await Wallet.findOne({ user: agent._id }).session(session);
        const userWallet = await Wallet.findOne({ user: user._id }).session(session);

        if (!agentWallet || !userWallet) {
            throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
        }

        if (agentWallet.isBlocked || userWallet.isBlocked) {
            throw new AppError(httpStatus.BAD_REQUEST, "Blocked wallet cannot perform operations");
        }

        if (agentWallet.balance < amount) {
            throw new AppError(httpStatus.BAD_REQUEST, "Agent has insufficient balance");
        }

        // Balance updates
        agentWallet.balance -= amount;
        userWallet.balance += amount;

        await agentWallet.save({ session });
        await userWallet.save({ session });

        // Transaction record
        await Transaction.create([{
            sender: agent._id,
            receiver: user._id,
            amount,
            type: TransactionType.CASH_IN,
            status: TransactionStatus.COMPLETED
        }], { session });

        await session.commitTransaction();
        session.endSession();


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }



}

const cashOutMoney = async (userId: string, agentPhone: string, amount: number) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        if (amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Amount must be greater than 0");
        }

        const user = await User.findById(userId).session(session);

        if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

        const agent = await User.findOne({ phone: agentPhone }).session(session);

        if (!agent) throw new AppError(httpStatus.NOT_FOUND, "Agent not found");

        const userWallet = await Wallet.findOne({ user: user._id }).session(session);
        const agentWallet = await Wallet.findOne({ user: agent._id }).session(session);

        if (!userWallet || !agentWallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

        if (userWallet.isBlocked || agentWallet.isBlocked) {
            throw new AppError(httpStatus.BAD_REQUEST, "Blocked wallet cannot perform operations");
        }

        if (userWallet.balance < amount) {
            throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
        }

        userWallet.balance -= amount;
        agentWallet.balance += amount;

        await userWallet.save({ session });
        await agentWallet.save({ session });

        await Transaction.create(
            [{
                sender: user._id,
                receiver: agent._id,
                amount,
                type: TransactionType.CASH_OUT,
                status: TransactionStatus.COMPLETED,
            }],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

      

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }



}

export const walletServices = {
    getAllWallets,
    getMyWallet,
    getWalletById,
    blockWallet,
    unBlockWallet,
    sendMoney,
    cashInMoney,
    cashOutMoney
}