import mongoose from "mongoose"
import { Schema } from "mongoose"

const OrderItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
})

const OrderSchema = new Schema({
  telegramUserId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  contactPhone: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  paymentReceipt: {
    image: String,
    uploadedAt: Date,
    notes: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Order || mongoose.model("Order", OrderSchema)
