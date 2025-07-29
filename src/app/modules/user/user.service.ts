import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, ...rest } = payload;

    // Step 1: Create user inside session
    const user = await User.create(
      [
        {
          email,
          password,
          ...rest,
        },
      ],
      { session }
    );
    const createdUser = user[0];

    // Step 2: Create wallet with session
    const wallet = await Wallet.create(
      [
        {
          user: createdUser._id, // ✅ correct key
        },
      ],
      { session }
    );

    // Step 3: Update user with wallet ID inside session
    const updatedUser = await User.findByIdAndUpdate(
      createdUser._id,
      { wallet: wallet[0]._id },
      { new: true, session } // ✅ session added
    );

    // ✅ Commit transaction
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
