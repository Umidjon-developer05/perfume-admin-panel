import { NextResponse } from 'next/server'
import { getOrderById } from '@/lib/data/orders'
type RouteContext = {
	params: {
		id: string
	}
}
export async function GET(request: Request, { params }: RouteContext) {
	try {
		const order = await getOrderById(params.id)

		if (!order) {
			return NextResponse.json({ error: 'Order not found' }, { status: 404 })
		}

		return NextResponse.json(order)
	} catch (error) {
		console.error('Error fetching order:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch order' },
			{ status: 500 }
		)
	}
}
