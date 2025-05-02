import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Admin from '@/lib/models/admin.model'
import { verifyToken } from '@/lib/generate-token'

export async function GET(request: NextRequest) {
	try {
		// Verify the token and extract user data
		const tokenData = verifyToken(request)

		// If no token data is found, return unauthorized
		if (!tokenData) {
			return NextResponse.json(
				{ success: false, message: 'Unauthorized' },
				{ status: 401 }
			)
		}

		// Connect to the database
		await connectToDatabase()

		// Get the user ID from the token
		const userId = tokenData.userId

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: 'User ID not found in token' },
				{ status: 400 }
			)
		}

		// Find the admin by ID
		const admin = await Admin.findById(userId).select('-password')

		if (!admin) {
			return NextResponse.json(
				{ success: false, message: 'Admin not found' },
				{ status: 404 }
			)
		}

		// Return the admin data
		return NextResponse.json({
			success: true,
			user: admin,
		})
	} catch (error) {
		console.error('Error fetching admin profile:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch admin profile' },
			{ status: 500 }
		)
	}
}
