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
const Category = mongoose.model('Category', CategorySchema)

export default Category
