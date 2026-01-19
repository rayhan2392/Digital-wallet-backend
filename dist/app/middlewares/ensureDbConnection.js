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
exports.ensureDbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
let isConnected = false;
const ensureDbConnection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (isConnected && mongoose_1.default.connection.readyState === 1) {
        return next();
    }
    try {
        if (mongoose_1.default.connection.readyState === 0) {
            yield mongoose_1.default.connect(env_1.envVars.DB_URL);
            isConnected = true;
            console.log("Database connected for serverless request");
        }
        next();
    }
    catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});
exports.ensureDbConnection = ensureDbConnection;
