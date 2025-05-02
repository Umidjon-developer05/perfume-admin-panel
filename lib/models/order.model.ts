import mongoose, { Schema, models } from 'mongoose'
import './product.model' // Import the Product model to ensure it's registered

const orderItemSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
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

const paymentReceiptSchema = new Schema({
	uploadedAt: {
		type: Date,
		default: Date.now,
	},
	image: {
		type: String,
		required: true,
	},
	notes: {
		type: String,
	},
})

const orderSchema = new Schema(
	{
		userName: {
			type: String,
			required: true,
		},
		telegramUserId: {
			type: String,
			required: true,
		},
		contactPhone: {
			type: String,
			required: true,
		},
		deliveryAddress: {
			type: String,
			required: true,
		},
		totalAmount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: [
				'pending',
				'paid',
				'confirmed',
				'shipped',
				'delivered',
				'cancelled',
			],
			default: 'pending',
		},
		items: [orderItemSchema],
		paymentReceipt: paymentReceiptSchema,
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

// Create or use existing Order model
const Order = models.Order || mongoose.model('Order', orderSchema)

export default Order
