import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import AppError from "../../errorHelper/AppError";
import httpStatus from "http-status-codes"

const createUser = async (payload: Partial<IUser>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, phone, ...rest } = payload;

    if (payload.role === "admin" || payload.role === "super_admin") {
      throw new AppError(403, "Not allowed to set this role");
    }


    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    const user = await User.create(
      [
        {
          email,
          phone,
          password: hashedPassword,
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


const createAdmin = async (payload: Partial<IUser>) => {

  const { email, password, ...rest } = payload;

  const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

  const admin = await User.create({
    email,
    password: hashedPassword,
    role: Role.ADMIN,
    isApproved: true,
    ...rest
  })

  return admin;

}


const getAllUsers = async () => {
  const users = await User.find({})
  return users;
}

const getSingleUser = async (id: string) => {
  const user = await User.findById(id)
  return user;
}

const handleBlockUser = async (id: string) => {

  const user = await User.findById(id)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found')
  }

  const isBlocked = user.isBlocked

  if (isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already blocked')
  }

  user.isBlocked = true;
  await user.save();
  return user;
}

const handleUnblockUser = async (id: string) => {

  const user = await User.findById(id)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found')
  }

  const isUnblocked = user.isBlocked

  if (!isUnblocked) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already unblocked')
  }

  user.isBlocked = false;
  await user.save();
  return user;
}

const handleApproveAgent = async (id: string) => {

  const user = await User.findById(id)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }
  if (user.role !== Role.AGENT) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is not agent')
  }

  const isApproved = user.isApproved

  if (isApproved) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Agent already approved')
  }

  user.isApproved = true;
  await user.save();
  return user;
}

const handleSuspendAgent = async (id: string) => {

  const user = await User.findById(id)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }
  if (user.role !== Role.AGENT) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is not agent')
  }

  const isApproved = user.isApproved

  if (!isApproved) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Agent already suspended')
  }

  user.isApproved = false;
  await user.save();
  return user;
}

export const userServices = {
  createUser,
  createAdmin,
  getAllUsers,
  getSingleUser,
  handleBlockUser,
  handleUnblockUser,
  handleApproveAgent,
  handleSuspendAgent,
};
