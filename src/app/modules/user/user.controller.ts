/* eslint-disable @typescript-eslint/no-unused-vars */
import {  NextFunction, Request,  Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";


const createUser=catchAsync(async(req:Request,res:Response,nex:NextFunction)=>{
      
    const user = await userServices.createUser(req.body)

    sendResponse(res,{
        statusCode:201,
        success:true,
        message:'user created successfully',
        data:user

    })

    //
})

const getAllUsers=catchAsync(async(req:Request,res:Response,nex:NextFunction)=>{
      
    const users = await userServices.getAllUsers()

    sendResponse(res,{
        statusCode:201,
        success:true,
        message:'users retrived successfully',
        data:users

    })

    //
})

const getSingleUser=catchAsync(async(req:Request,res:Response,nex:NextFunction)=>{
      
    const user = await userServices.getSingleUser(req.params.id)

    sendResponse(res,{
        statusCode:201,
        success:true,
        message:'user retrived successfully',
        data:user

    })

    //
})

const handleBlockUser=catchAsync(async(req:Request,res:Response,nex:NextFunction)=>{
      
    const user = await userServices.handleBlockUser(req.params.id)

    sendResponse(res,{
        statusCode:201,
        success:true,
        message:'user blocked successfully',
        data:user

    })

    //
})

const handleUnblockUser=catchAsync(async(req:Request,res:Response,nex:NextFunction)=>{
      
    const user = await userServices.handleUnblockUser(req.params.id)

    sendResponse(res,{
        statusCode:201,
        success:true,
        message:'user unblocked successfully',
        data:user

    })

    //
})

const handleApproveAgent=catchAsync(async(req:Request,res:Response,nex:NextFunction)=>{
      
    const user = await userServices.handleApproveAgent(req.params.id)

    sendResponse(res,{
        statusCode:201,
        success:true,
        message:'agent approved successfully',
        data:user

    })

    //
})

const handleSuspendAgent=catchAsync(async(req:Request,res:Response,nex:NextFunction)=>{
      
    const user = await userServices.handleSuspendAgent(req.params.id)

    sendResponse(res,{
        statusCode:201,
        success:true,
        message:'agent suspended successfully',
        data:user

    })

    //
})

export const userControllers= {
    createUser,
    getAllUsers,
    getSingleUser,
    handleBlockUser,
    handleUnblockUser,
    handleApproveAgent,
    handleSuspendAgent
}