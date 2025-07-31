/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { walletServices } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";

const getAllWallets = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const wallet = await walletServices.getAllWallets()

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Wallets retrived successfully',
        data: wallet

    })

})

const getMyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const wallet = await walletServices.getMyWallet(req.user.userId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'wallet retrived successfully',
        data: wallet

    })

})

const getWalletById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const wallet = await walletServices.getWalletById(req.params.id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'wallet retrived successfully',
        data: wallet

    })

})

const blockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const wallet = await walletServices.blockWallet(req.params.id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Wallet blocked successfully',
        data: wallet

    })

})

const unBlockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const wallet = await walletServices.unBlockWallet(req.params.id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Wallet unblocked successfully',
        data: wallet

    })

})

const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { receiverPhone, amount } = req.body
    const senderId = req.user.userId;

    await walletServices.sendMoney(senderId, receiverPhone, amount)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Money sent successfully',
        data: null

    })

})

const cashInMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { userPhone, amount } = req.body
    const agentId = req.user.userId;

    await walletServices.cashInMoney(agentId, userPhone, amount)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Cash In successfull!!',
        data: null

    })

})

const cashOutMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { agentPhone, amount } = req.body
    const senderId = req.user.userId;

    await walletServices.cashOutMoney(senderId, agentPhone, amount)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Cash out successfull',
        data: null

    })

})


export const walletControllers = {
    getAllWallets,
    getMyWallet,
    getWalletById,
    blockWallet,
    unBlockWallet,
    sendMoney,
    cashInMoney,
    cashOutMoney
}