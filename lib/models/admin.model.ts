import mongoose, { Schema, models } from 'mongoose'

// Define the Admin schema
const adminSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
		},
		role: {
			type: String,
			enum: ['admin', 'superadmin'],
			default: 'admin',
		},
		// Add any other fields you need
	},
	{ timestamps: true }
)

// Create or use existing Admin model
const Admin = models.Admin || mongoose.model('Admin', adminSchema)

export default Admin
