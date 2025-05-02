import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

// Function to generate a new token
export const generateToken = (userId: string) => {
	const token = jwt.sign({ userId }, process.env.NEXT_PUBLIC_JWT_SECRET!, {
		expiresIn: '1d', // Changed to 1 day for better user experience
	})
	return token
}

// Function to verify and extract data from a token
export const verifyToken = (req: NextRequest) => {
	try {
		// Get the Authorization header
		const authHeader = req.headers.get('Authorization')

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return null
		}

		// Extract the token
		const token = authHeader.split(' ')[1]

		// Verify the token
		const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as {
			userId: string
		}

		return decoded
	} catch (error) {
		console.error('Token verification failed:', error)
		return null
	}
}
