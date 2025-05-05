import mongoose, { Schema, model, models } from 'mongoose'

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
		brand: {
			type: String,
			required: [true, 'Product brand is required'],
		},
		volume: {
			type: String,
			required: [true, 'Product volume is required'],
		},
		featured: {
			type: Boolean,
			default: false,
		},
		category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
		inStock: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
)

const ProductModel = models.Product || model('Product', productSchema)

export default ProductModel
