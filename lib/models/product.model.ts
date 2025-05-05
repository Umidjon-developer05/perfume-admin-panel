import mongoose, { Schema, model, models } from 'mongoose'

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
		category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
		inStock: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
)

// ✅ This line prevents the OverwriteModelError
const ProductModel = models.Product || model('Product', productSchema)

export default ProductModel
