import mongoose, { Schema } from 'mongoose'

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	imageUrl: {
		type: String,
	},
})
const Category =
	mongoose.models.Category || mongoose.model('Category', categorySchema)

export default Category
