import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = (global as any).mongoose

if (!cached) {
	cached = (global as any).mongoose = { conn: null, promise: null }
}
let isConnected = false
export async function connectToDatabase() {
	if (isConnected) return

	await mongoose.connect(process.env.MONGODB_URI!)
	isConnected = true
}
