'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface OrderItem {
	product: {
		_id: string
		name: string
		imageUrl: string
	}
	quantity: number
	price: number
	_id: string
}

interface Order {
	_id: string
	telegramUserId: string
	userName: string
	items: OrderItem[]
	totalAmount: number
	status: string
	contactPhone: string
	deliveryAddress: string
	createdAt: string
	isRead: boolean
}

export default function OrdersPage() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const [orders, setOrders] = useState<Order[]>([])
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 1,
	})

	const [status, setStatus] = useState('')

	useEffect(() => {
		const page = Number(searchParams.get('page') || 1)
		const limit = Number(searchParams.get('limit') || 10)
		const search = searchParams.get('search') || ''
		const status = searchParams.get('status') || ''

		setStatus(status)

		async function fetchOrders() {
			try {
				const response = await fetch(
					`/api/orders?page=${page}&limit=${limit}&search=${search}&status=${status}`
				)
				const data = await response.json()
				setOrders(data.orders)
				setPagination(data.pagination)
			} catch (error) {
				console.error('Failed to fetch orders:', error)
			}
		}

		fetchOrders()
	}, [searchParams])

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', page.toString())
		router.push(`/dashboard/orders?${params.toString()}`)
	}

	const handleLimitChange = (limit: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('limit', limit.toString())
		params.set('page', '1')
		router.push(`/dashboard/orders?${params.toString()}`)
	}

	const handleSearch = (search: string) => {
		const params = new URLSearchParams(searchParams)
		if (search) {
			params.set('search', search)
		} else {
			params.delete('search')
		}
		params.set('page', '1')
		router.push(`/dashboard/orders?${params.toString()}`)
	}

	const handleStatusChange = (status: string) => {
		const params = new URLSearchParams(searchParams)
		if (status) {
			params.set('status', status)
		} else {
			params.delete('status')
		}
		params.set('page', '1')
		router.push(`/dashboard/orders?${params.toString()}`)
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'pending':
				return <Badge variant='outline'>Pending</Badge>
			case 'paid':
				return <Badge variant='secondary'>Paid</Badge>
			case 'confirmed':
				return <Badge variant='default'>Confirmed</Badge>
			case 'shipped':
				return <Badge variant='secondary'>Shipped</Badge>
			case 'delivered':
				return <Badge variant='default'>Delivered</Badge>
			case 'cancelled':
				return <Badge variant='destructive'>Cancelled</Badge>
			default:
				return <Badge variant='outline'>{status}</Badge>
		}
	}

	const columns = [
		{
			header: 'ID',
			accessorKey: '_id',
			cell: (order: Order) => <div className='font-medium'>#{order._id}</div>,
		},
		{
			header: 'Order',
			accessorKey: 'order',
			cell: (order: Order) => (
				<div className='flex flex-col'>
					<span className='font-medium'>#{order._id.substring(0, 8)}</span>
					<span className='text-sm text-muted-foreground'>
						{formatDate(order.createdAt)}
					</span>
					{!order.isRead && (
						<Badge variant='destructive' className='mt-1 w-fit'>
							New
						</Badge>
					)}
				</div>
			),
		},
		{
			header: 'Customer',
			accessorKey: 'customer',
			cell: (order: Order) => (
				<div className='flex flex-col'>
					<span className='font-medium'>{order.userName}</span>
					<span className='text-sm text-muted-foreground'>
						{order.contactPhone}
					</span>
				</div>
			),
		},
		{
			header: 'Items',
			accessorKey: 'items',
			cell: (order: Order) => (
				<div className='flex flex-col'>
					<span>{order.items.map(item => `${item?._id}`)}</span>
					<span>{order.items.length} items</span>
					<span className='text-sm text-muted-foreground'>
						{order.items
							.map(item => `${item.quantity}x ${item.product.name}`)
							.join(', ')
							.substring(0, 30)}
						{order.items
							.map(item => `${item.quantity}x ${item.product.name}`)
							.join(', ').length > 30 && '...'}
					</span>
				</div>
			),
		},
		{
			header: 'Total',
			accessorKey: 'totalAmount',
			cell: (order: Order) => (
				<span className='font-medium'>
					{order.totalAmount.toLocaleString()} so&apos;m
				</span>
			),
		},
		{
			header: 'Status',
			accessorKey: 'status',
			cell: (order: Order) => getStatusBadge(order.status),
		},
		{
			header: 'Actions',
			accessorKey: 'actions',
			cell: (order: Order) => (
				<div className='flex items-center gap-2'>
					<Badge
						variant='outline'
						className='cursor-pointer'
						onClick={() => router.push(`/dashboard/orders/${order._id}`)}
					>
						View
					</Badge>
				</div>
			),
		},
	]

	const statusOptions = [
		{ label: 'Pending', value: 'pending' },
		{ label: 'Paid', value: 'paid' },
		{ label: 'Confirmed', value: 'confirmed' },
		{ label: 'Shipped', value: 'shipped' },
		{ label: 'Delivered', value: 'delivered' },
		{ label: 'Cancelled', value: 'cancelled' },
	]

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-bold'>Orders</h1>
			</div>

			<DataTable
				data={orders}
				columns={columns}
				pagination={pagination}
				onPageChange={handlePageChange}
				onLimitChange={handleLimitChange}
				onSearch={handleSearch}
				searchPlaceholder='Search orders...'
				filters={[
					{
						name: 'Status',
						options: statusOptions,
						value: status,
						onChange: handleStatusChange,
					},
				]}
			/>
		</div>
	)
}
