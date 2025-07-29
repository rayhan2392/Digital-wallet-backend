import {  NextFunction, Request,  Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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


export const userControllers= {
    createUser
}