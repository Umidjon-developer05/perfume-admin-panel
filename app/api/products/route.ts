import { type NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/data/products'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const page = Number(searchParams.get('page')) || 1
		const limit = Number(searchParams.get('limit')) || 10
		const category = searchParams.get('category') || ''
		const search = searchParams.get('search') || ''

		const result = await getProducts(page, limit, category, search)
		
		return NextResponse.json(result)
	} catch (error: any) {
		console.error('Error fetching products:', error)
		return NextResponse.json(
			{ error: error?.message || 'Failed to fetch products' },
			{ status: 500 }
		)
	}
}
