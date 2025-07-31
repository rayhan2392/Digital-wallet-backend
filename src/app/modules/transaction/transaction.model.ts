import { Schema, model } from "mongoose";
import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.COMPLETED,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
