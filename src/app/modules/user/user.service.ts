import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, ...rest } = payload;

   

    const hashedPassword =await bcrypt.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND))
    const user = await User.create(
      [
        {
          email,
          password:hashedPassword,
          ...rest,
        },
      ],
      { session }
    );
    const createdUser = user[0];

   
    const wallet = await Wallet.create(
      [
        {
          user: createdUser._id, 
        },
      ],
      { session }
    );

    
    const updatedUser = await User.findByIdAndUpdate(
      createdUser._id,
      { wallet: wallet[0]._id },
      { new: true, session } 
    );

   
    await session.commitTransaction();
    session.endSession();

    return updatedUser;
  } catch (error) {
    // ❌ Rollback
    await session.abortTransaction();
    session.endSession();
    console.log("Transaction failed:", error);
    throw error;
  }
};

export const userServices = {
  createUser,
};
