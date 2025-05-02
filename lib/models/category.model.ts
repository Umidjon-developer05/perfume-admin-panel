import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const CategorySchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	description: {
		type: String,
	},
	imageUrl: {
		type: String,
	},
})

export default mongoose.models.Category ||
	mongoose.model('Category', CategorySchema)
