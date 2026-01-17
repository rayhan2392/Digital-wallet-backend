"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const wallet_model_1 = require("./wallet.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const getAllWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_model_1.Wallet.find().populate("user", "name email role");
    return wallets;
});
const getMyWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).populate("user", "name");
    if (!wallet) {
        throw new AppError_1.default(404, "No wallet found for this user");
    }
    return wallet;
});
const getWalletById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findById(id).populate("user", "name");
    // if (!wallet) {
    //     throw new AppError(404, "No wallet found for this user");
    // }
    return wallet;
});
const blockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ user: userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Wallet not found');
    }
    if (wallet.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Wallet already blocked');
    }
    wallet.isBlocked = true;
    yield wallet.save();
    return wallet;
});
const unBlockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ user: userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Wallet not found');
    }
    if (!wallet.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Wallet already unblocked');
    }
    wallet.isBlocked = false;
    yield wallet.save();
    return wallet;
});
const sendMoney = (senderId, receiverPhone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Amount must be greater than 0");
        }
        const sender = yield user_model_1.User.findById(senderId).session(session);
        if (!sender) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender not found");
        }
        const receiver = yield user_model_1.User.findOne({ phone: receiverPhone }).session(session);
        if (!receiver) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver not found");
        }
        const senderWallet = yield wallet_model_1.Wallet.findOne({ user: sender._id }).session(session);
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiver._id }).session(session);
        if (!senderWallet || !receiverWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
        }
        if (senderWallet.isBlocked || receiverWallet.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Blocked wallet cannot perform operations");
        }
        if (senderWallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
        }
        // Update balances
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        // Create transaction
        yield transaction_model_1.Transaction.create([{
                sender: sender._id,
                receiver: receiver._id,
                amount,
                type: transaction_interface_1.TransactionType.SEND_MONEY,
                status: transaction_interface_1.TransactionStatus.COMPLETED
            }], { session });
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cashInMoney = (agentId, userPhone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Amount must be greater than 0");
        }
        const agent = yield user_model_1.User.findById(agentId).session(session);
        const user = yield user_model_1.User.findOne({ phone: userPhone }).session(session);
        if (!agent || !user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent or user not found");
        }
        const agentWallet = yield wallet_model_1.Wallet.findOne({ user: agent._id }).session(session);
        const userWallet = yield wallet_model_1.Wallet.findOne({ user: user._id }).session(session);
        if (!agentWallet || !userWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
        }
        if (agentWallet.isBlocked || userWallet.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Blocked wallet cannot perform operations");
        }
        if (agentWallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent has insufficient balance");
        }
        // Balance updates
        agentWallet.balance -= amount;
        userWallet.balance += amount;
        yield agentWallet.save({ session });
        yield userWallet.save({ session });
        // Transaction record
        yield transaction_model_1.Transaction.create([{
                sender: agent._id,
                receiver: user._id,
                amount,
                type: transaction_interface_1.TransactionType.CASH_IN,
                status: transaction_interface_1.TransactionStatus.COMPLETED
            }], { session });
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cashOutMoney = (userId, agentPhone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Amount must be greater than 0");
        }
        const user = yield user_model_1.User.findById(userId).session(session);
        if (!user)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        const agent = yield user_model_1.User.findOne({ phone: agentPhone }).session(session);
        if (!agent)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
        const userWallet = yield wallet_model_1.Wallet.findOne({ user: user._id }).session(session);
        const agentWallet = yield wallet_model_1.Wallet.findOne({ user: agent._id }).session(session);
        if (!userWallet || !agentWallet)
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
        if (userWallet.isBlocked || agentWallet.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Blocked wallet cannot perform operations");
        }
        if (userWallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
        }
        userWallet.balance -= amount;
        agentWallet.balance += amount;
        yield userWallet.save({ session });
        yield agentWallet.save({ session });
        yield transaction_model_1.Transaction.create([{
                sender: user._id,
                receiver: agent._id,
                amount,
                type: transaction_interface_1.TransactionType.CASH_OUT,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
            }], { session });
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.walletServices = {
    getAllWallets,
    getMyWallet,
    getWalletById,
    blockWallet,
    unBlockWallet,
    sendMoney,
    cashInMoney,
    cashOutMoney
};
