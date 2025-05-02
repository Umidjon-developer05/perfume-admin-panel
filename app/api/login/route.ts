import { type NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/models/db'
import Admin from '@/lib/models/admin.model'
import { generateToken } from '@/lib/generate-token'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json()

		// Validate input
		if (!email || !password) {
			return NextResponse.json(
				{ success: false, message: 'Email and password are required' },
				{ status: 400 }
			)
		}

		// Connect to the database
		await connectToDatabase()

		// Find the admin by email
		const admin = await Admin.findOne({ email })

		if (!admin) {
			return NextResponse.json(
				{ success: false, message: 'Invalid credentials' },
				{ status: 401 }
			)
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, admin.password)

		if (!isPasswordValid) {
			return NextResponse.json(
				{ success: false, message: 'Invalid credentials' },
				{ status: 401 }
			)
		}

		// Generate token
		const token = generateToken(admin._id.toString())

		// Return success with token and user data
		return NextResponse.json({
			success: true,
			token,
			user: {
				_id: admin._id,
				name: admin.name,
				email: admin.email,
				role: admin.role,
			},
		})
	} catch (error) {
		console.error('Login error:', error)
		return NextResponse.json(
			{ success: false, message: 'Login failed' },
			{ status: 500 }
		)
	}
}
