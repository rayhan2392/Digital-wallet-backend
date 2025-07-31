import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import httpStatus from "http-status-codes"
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { JwtPayload } from "jsonwebtoken";
export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw new AppError(httpStatus.NOT_FOUND, 'No token received')
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        if (!verifiedToken) {
            throw new AppError(httpStatus.BAD_REQUEST, 'token not verified')
        }

        const isUserExist = await User.findById(verifiedToken.userId)

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
        }

        if (isUserExist.isBlocked === true || isUserExist.isApproved === false) {
            throw new AppError(httpStatus.BAD_REQUEST, "Your account is either blocked or not approved yet")
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized access')
        }
        req.user = verifiedToken;
        next()
    } catch (error) {
        next(error)
    }
}