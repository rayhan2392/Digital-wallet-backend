// src/modules/user/user.model.ts

import { Schema, model } from "mongoose";
import { IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default:Role.USER
    },

    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },

    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      required: function () {
        return this.role === Role.AGENT;
      },
      default: function () {
        return this.role === Role.AGENT ? false : undefined;
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
