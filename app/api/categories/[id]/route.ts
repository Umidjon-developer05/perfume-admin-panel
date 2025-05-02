import { getCategoryById } from '@/lib/data/categories'
import { NextResponse } from 'next/server'

type RouteContext = {
	params: {
		id: string
	}
}

export async function GET(request: Request, { params }: RouteContext) {
	try {
		const category = await getCategoryById(params.id)

		if (!category) {
			return NextResponse.json({ error: 'Category not found' }, { status: 404 })
		}

		return NextResponse.json(category)
	} catch (error) {
		console.error('Error fetching category:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch category' },
			{ status: 500 }
		)
	}
}
