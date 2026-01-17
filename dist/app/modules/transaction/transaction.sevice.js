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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionServices = void 0;
const mongoose_1 = require("mongoose");
const transaction_model_1 = require("./transaction.model");
const getAllTransactions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find(query)
        .populate("sender", "name email phone")
        .populate("receiver", "name email phone")
        .sort({ createdAt: -1 });
    const totalTransactions = yield transaction_model_1.Transaction.countDocuments(query);
    return {
        data: transactions,
        meta: {
            total: totalTransactions
        }
    };
});
const getMyTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const myTransactions = yield transaction_model_1.Transaction.find({
        $or: [
            { sender: new mongoose_1.Types.ObjectId(userId) },
            { receiver: new mongoose_1.Types.ObjectId(userId) }
        ]
    })
        .populate("sender", "name email phone")
        .populate("receiver", "name email phone")
        .sort({ createdAt: -1 });
    return myTransactions;
});
exports.transactionServices = {
    getAllTransactions,
    getMyTransactions
};
