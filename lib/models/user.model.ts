import mongoose from "mongoose"
import { Schema } from "mongoose"

const UserSchema = new Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  referredBy: {
    type: [String],
    default: [],
  },
  referralCount: {
    type: Number,
    default: 0,
  },
  referralBonus: {
    type: Number,
    default: 0,
  },
  referralPurchases: [
    {
      orderId: String,
      referredUserId: String,
      amount: Number,
      bonus: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
