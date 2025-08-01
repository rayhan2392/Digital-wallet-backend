import { transactionServices } from './transaction.sevice';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { Transaction } from "./transaction.model";
import { sendResponse } from '../../utils/sendResponse';

const getAllTransactions = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
   
    const trasactions = await transactionServices.getAllTransactions();

    sendResponse(res,{
        statusCode:200,
        success:true,
        message:'Transactions retrived successfully',
        data:trasactions
    })

})

const getMyTransactions = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const userId = req.user.userId
   
    const myTrasactions = await transactionServices.getMyTransactions(userId);

    sendResponse(res,{
        statusCode:200,
        success:true,
        message:'Transactions retrived successfully',
        data:myTrasactions
    })

})

export const transactionControllers = {
    getAllTransactions,
    getMyTransactions
}