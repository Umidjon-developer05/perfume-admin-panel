import { model, models, Schema } from 'mongoose'

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
const Category = models.Category || model('Category', categorySchema)

export default Category
