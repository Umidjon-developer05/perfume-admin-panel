import mongoose, { Schema, models } from 'mongoose'

// Define the Product schema
const productSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Product name is required'],
		},
		description: {
			type: String,
			required: [true, 'Product description is required'],
		},
		price: {
			type: Number,
			required: [true, 'Product price is required'],
		},
		imageUrl: {
			type: String,
			required: [true, 'Product image is required'],
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: [true, 'Product category is required'],
		},
		// Add any other fields your product needs
		inStock: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
)

// Create or use existing Product model
const Product = models.Product || mongoose.model('Product', productSchema)

export default Product
