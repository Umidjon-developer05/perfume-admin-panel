import mongoose, { Schema } from 'mongoose'

const checkSchema = new Schema({
	chatId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
		default: '',
	},
})
const Check = mongoose.models.Check || mongoose.model('Check', checkSchema)

export default Check
