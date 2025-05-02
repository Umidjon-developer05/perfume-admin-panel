import { type NextRequest, NextResponse } from 'next/server'
import { getUsers } from '@/lib/data/users'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const page = Number(searchParams.get('page')) || 1
		const limit = Number(searchParams.get('limit')) || 10
		const search = searchParams.get('search') || ''

		const result = await getUsers(page, limit, search)

		return NextResponse.json(result)
	} catch (error) {
		console.error('Error fetching users:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch users' },
			{ status: 500 }
		)
	}
}
