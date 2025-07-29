import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import { Wallet } from "../wallet/wallet.model";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser=async(req: Request, res: Response, next: NextFunction)=>{

    const {email,password,...rest}= req.body;
    try {
        const user = await User.create({
            email,
            password,
            ...rest
        })

        const wallet = await Wallet.create({
            userId:user._id
        })

        const updatedUser = await User.findByIdAndUpdate(user._id,{wallet:wallet._id})

        res.status(201).json({
            success:true,
            message:'user created successfully',
            data:updatedUser
        })
    } catch (error) {
        console.log(error)
    }

    
}


export const userControllers= {
    createUser
}