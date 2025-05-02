import { type NextRequest, NextResponse } from 'next/server'
import { getOrders } from '@/lib/data/orders'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const page = Number(searchParams.get('page')) || 1
		const limit = Number(searchParams.get('limit')) || 10
		const status = searchParams.get('status') || ''
		const search = searchParams.get('search') || ''

		const result = await getOrders(page, limit, status, search)

		return NextResponse.json(result)
	} catch (error) {
		console.error('Error fetching orders:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch orders' },
			{ status: 500 }
		)
	}
}
