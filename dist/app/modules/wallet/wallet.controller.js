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
exports.walletControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const wallet_service_1 = require("./wallet.service");
const sendResponse_1 = require("../../utils/sendResponse");
const getAllWallets = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_service_1.walletServices.getAllWallets();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Wallets retrived successfully',
        data: wallet
    });
}));
const getMyWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_service_1.walletServices.getMyWallet(req.user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'wallet retrived successfully',
        data: wallet
    });
}));
const getWalletById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_service_1.walletServices.getWalletById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'wallet retrived successfully',
        data: wallet
    });
}));
const blockWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_service_1.walletServices.blockWallet(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Wallet blocked successfully',
        data: wallet
    });
}));
const unBlockWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_service_1.walletServices.unBlockWallet(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Wallet unblocked successfully',
        data: wallet
    });
}));
const sendMoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverPhone, amount } = req.body;
    const senderId = req.user.userId;
    yield wallet_service_1.walletServices.sendMoney(senderId, receiverPhone, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Money sent successfully',
        data: null
    });
}));
const cashInMoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userPhone, amount } = req.body;
    const agentId = req.user.userId;
    yield wallet_service_1.walletServices.cashInMoney(agentId, userPhone, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Cash In successfull!!',
        data: null
    });
}));
const cashOutMoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentPhone, amount } = req.body;
    const senderId = req.user.userId;
    yield wallet_service_1.walletServices.cashOutMoney(senderId, agentPhone, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Cash out successfull',
        data: null
    });
}));
exports.walletControllers = {
    getAllWallets,
    getMyWallet,
    getWalletById,
    blockWallet,
    unBlockWallet,
    sendMoney,
    cashInMoney,
    cashOutMoney
};
