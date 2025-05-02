import { type NextRequest, NextResponse } from 'next/server'
import { getCategories } from '@/lib/data/categories'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const page = Number(searchParams.get('page')) || 1
		const limit = Number(searchParams.get('limit')) || 10
		const search = searchParams.get('search') || ''

		const result = await getCategories(page, limit, search)

		return NextResponse.json(result)
	} catch (error) {
		console.error('Error fetching categories:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch categories' },
			{ status: 500 }
		)
	}
}
