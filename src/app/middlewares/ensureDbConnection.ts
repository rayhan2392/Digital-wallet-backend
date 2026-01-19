/* eslint-disable no-console */
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { envVars } from "../config/env";

let isConnected = false;

export const ensureDbConnection = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return next();
    }

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(envVars.DB_URL);
            isConnected = true;
            console.log("Database connected for serverless request");
        }
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
};
