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
exports.userControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
const user_model_1 = require("./user.model");
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'user created successfully',
        data: user
    });
    //
}));
const createAdmin = (0, catchAsync_1.catchAsync)((req, res, nex) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield user_service_1.userServices.createAdmin(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'user created successfully',
        data: admin
    });
    //
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, nex) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield user_service_1.userServices.getAllUsers(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'users retrived successfully',
        data: result.data,
        meta: result.meta
    });
    //
}));
const getAllAgents = (0, catchAsync_1.catchAsync)((req, res, nex) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield user_service_1.userServices.getAllAgents(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'agents retrived successfully',
        data: result.data,
        meta: result.meta
    });
    //
}));
const getSingleUser = (0, catchAsync_1.catchAsync)((req, res, nex) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userServices.getSingleUser(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'user retrived successfully',
        data: user
    });
    //
}));
const getMyProfile = (0, catchAsync_1.catchAsync)((req, res, nex) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const user = yield user_model_1.User.findById(userId).populate("wallet");
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'user profile retrived successfully',
        data: user
    });
    //
}));
const handleBlockUser = (0, catchAsync_1.catchAsync)((req, res, nex) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userServices.handleBlockUser(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'user blocked successfully',
        data: user
    });
    //
}));
const handleUnblockUser = (0, catchAsync_1.catchAsync)((req, res, nex) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userServices.handleUnblockUser(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'user unblocked successfully',
        data: user
    });
    //
}));
const handleApproveAgent = (0, catchAsync_1.catchAsync)((req, res, nex) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userServices.handleApproveAgent(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'agent approved successfully',
        data: user
    });
    //
}));
const handleSuspendAgent = (0, catchAsync_1.catchAsync)((req, res, nex) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userServices.handleSuspendAgent(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'agent suspended successfully',
        data: user
    });
    //
}));
exports.userControllers = {
    createUser,
    createAdmin,
    getAllUsers,
    getSingleUser,
    handleBlockUser,
    handleUnblockUser,
    handleApproveAgent,
    handleSuspendAgent,
    getMyProfile,
    getAllAgents
};
