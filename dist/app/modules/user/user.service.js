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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("../wallet/wallet.model");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { email, password, phone } = payload, rest = __rest(payload, ["email", "password", "phone"]);
        if (payload.role === "admin" || payload.role === "super_admin") {
            throw new AppError_1.default(403, "Not allowed to set this role");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const user = yield user_model_1.User.create([
            Object.assign({ email,
                phone, password: hashedPassword }, rest),
        ], { session });
        const createdUser = user[0];
        const wallet = yield wallet_model_1.Wallet.create([
            {
                user: createdUser._id,
            },
        ], { session });
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(createdUser._id, { wallet: wallet[0]._id }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return updatedUser;
    }
    catch (error) {
        // ❌ Rollback
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const admin = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, role: user_interface_1.Role.ADMIN, isApproved: true }, rest));
    return admin;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find(query);
    const totalUsers = yield user_model_1.User.countDocuments(query);
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
});
const getAllAgents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find(Object.assign(Object.assign({}, query), { role: "agent", isApproved: true }));
    const totalUsers = yield user_model_1.User.countDocuments(Object.assign(Object.assign({}, query), { role: "agent", isApproved: true }));
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    return user;
});
const handleBlockUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'user not found');
    }
    const isBlocked = user.isBlocked;
    if (isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User already blocked');
    }
    user.isBlocked = true;
    yield user.save();
    return user;
});
const handleUnblockUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'user not found');
    }
    const isUnblocked = user.isBlocked;
    if (!isUnblocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User already unblocked');
    }
    user.isBlocked = false;
    yield user.save();
    return user;
});
const handleApproveAgent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    if (user.role !== user_interface_1.Role.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User is not agent');
    }
    const isApproved = user.isApproved;
    if (isApproved) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Agent already approved');
    }
    user.isApproved = true;
    yield user.save();
    return user;
});
const handleSuspendAgent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    if (user.role !== user_interface_1.Role.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User is not agent');
    }
    const isApproved = user.isApproved;
    if (!isApproved) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Agent already suspended');
    }
    user.isApproved = false;
    yield user.save();
    return user;
});
exports.userServices = {
    createUser,
    createAdmin,
    getAllUsers,
    getSingleUser,
    handleBlockUser,
    handleUnblockUser,
    handleApproveAgent,
    handleSuspendAgent,
    getAllAgents
};
