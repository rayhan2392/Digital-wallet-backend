// src/modules/wallet/wallet.model.ts

import { Schema, model} from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    user:{
          type:Schema.Types.ObjectId,
          ref:"User",
          required:true
    },
    

    balance: {
      type: Number,
      required: true,
      default: 50, // 🎯 initial balance
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
 
   
  },
  {
     timestamps: true,
  }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
