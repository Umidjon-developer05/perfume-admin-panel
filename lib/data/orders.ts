import { connectToDatabase } from '@/lib/models/db'
import OrderModel from '@/lib/models/order.model'

interface QueryParams {
	page?: number
	limit?: number
	status?: string
	search?: string
	$or?: Array<{ [key: string]: object }>
}

interface OrderItem {
	product: {
		name: string
		imageUrl: string
		brand?: string
		volume?: string
	}
}

interface Order {
	_id: string
	status: string
	isRead: boolean
	totalAmount: number
	createdAt: Date
	items: OrderItem[]
	telegramUserId: string
	userName: string
	contactPhone: string
	deliveryAddress: string
}

interface OrderStats {
	totalOrders: number
	pendingOrders: number
	paidOrders: number
	confirmedOrders: number
	shippedOrders: number
	deliveredOrders: number
	cancelledOrders: number
	unreadOrders: number
	totalRevenue: number
	newOrdersToday: number
}

export async function getOrderById(id: string): Promise<Order | null> {
	try {
		await connectToDatabase()
		const order = (await OrderModel.findById(id)
			.populate({
				path: 'items.product',
				select: 'name imageUrl brand volume',
			})
			.lean()) as Order | null // Type assertion to Order or null

		return order
	} catch (error) {
		console.error('Failed to fetch order:', error)
		throw new Error('Failed to fetch order')
	}
}

export async function getOrders(
	page: number = 1,
	limit: number = 10,
	status: string = '',
	search: string = ''
): Promise<{
	orders: Order[]
	pagination: { total: number; page: number; limit: number; totalPages: number }
}> {
	try {
		await connectToDatabase()

		let query: QueryParams = {}

		if (status) {
			query.status = status
		}

		if (search) {
			query = {
				...query,
				$or: [
					{ telegramUserId: { $regex: search, $options: 'i' } },
					{ userName: { $regex: search, $options: 'i' } },
					{ contactPhone: { $regex: search, $options: 'i' } },
					{ deliveryAddress: { $regex: search, $options: 'i' } },
				],
			}
		}

		const skip = (page - 1) * limit

		const orders = await OrderModel.find(query)
			.populate({
				path: 'items.product',
				select: 'name imageUrl',
			})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean()

		// Explicit type cast to Order[] after casting to unknown first
		const typedOrders = orders as unknown as Order[]

		const total = await OrderModel.countDocuments(query)

		return {
			orders: typedOrders,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		}
	} catch (error) {
		console.error('Failed to fetch orders:', error)
		throw new Error('Failed to fetch orders')
	}
}

export async function updateOrderStatus(
	id: string,
	status: string
): Promise<Order | null> {
	try {
		console.log(id, status)
		await connectToDatabase()
		const order = await OrderModel.findByIdAndUpdate(
			{ _id: id },
			{ status: status },
			{ new: true }
		)
		return order
	} catch (error) {
		console.error('Failed to update order status:', error)
		throw new Error('Failed to update order status')
	}
}

export async function markOrderAsRead(id: string): Promise<Order | null> {
	try {
		await connectToDatabase()
		const order = await OrderModel.findByIdAndUpdate(
			id,
			{ isRead: true },
			{ new: true }
		)
		return order
	} catch (error) {
		console.error('Failed to mark order as read:', error)
		throw new Error('Failed to mark order as read')
	}
}

export async function getOrderStats(): Promise<OrderStats> {
	try {
		await connectToDatabase()

		const totalOrders = await OrderModel.countDocuments()
		const pendingOrders = await OrderModel.countDocuments({ status: 'pending' })
		const paidOrders = await OrderModel.countDocuments({ status: 'paid' })
		const confirmedOrders = await OrderModel.countDocuments({
			status: 'confirmed',
		})
		const shippedOrders = await OrderModel.countDocuments({ status: 'shipped' })
		const deliveredOrders = await OrderModel.countDocuments({
			status: 'delivered',
		})
		const cancelledOrders = await OrderModel.countDocuments({
			status: 'cancelled',
		})

		const unreadOrders = await OrderModel.countDocuments({ isRead: false })

		const totalRevenue = await OrderModel.aggregate([
			{
				$match: {
					status: { $in: ['paid', 'confirmed', 'shipped', 'delivered'] },
				},
			},
			{ $group: { _id: null, total: { $sum: '$totalAmount' } } },
		])

		const newOrdersToday = await OrderModel.countDocuments({
			createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
		})

		return {
			totalOrders,
			pendingOrders,
			paidOrders,
			confirmedOrders,
			shippedOrders,
			deliveredOrders,
			cancelledOrders,
			unreadOrders,
			totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
			newOrdersToday,
		}
	} catch (error) {
		console.error('Failed to fetch order stats:', error)
		throw new Error('Failed to fetch order stats')
	}
}
