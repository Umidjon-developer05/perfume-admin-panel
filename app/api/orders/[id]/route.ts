import { NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus } from '@/lib/data/orders'
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
export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { status } = await req.json()
		const updatedOrder = await updateOrderStatus(params.id, status)

		if (!updatedOrder) {
			return NextResponse.json({ error: 'Order not found' }, { status: 404 })
		}

		return NextResponse.json(updatedOrder)
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
