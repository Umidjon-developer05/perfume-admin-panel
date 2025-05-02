import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getOrderById } from '@/lib/data/orders'
import { updateOrder, markAsRead } from '@/lib/actions/orders'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import {
	ArrowLeft,
	User,
	Phone,
	MapPin,
	Calendar,
	Package,
	DollarSign,
	CreditCard,
} from 'lucide-react'

interface OrderItem {
	product: {
		imageUrl: string
		name: string
	}
	price: number
	quantity: number
}

interface PaymentReceipt {
	uploadedAt: string
	image: string
	notes: string
}

interface Order {
	_id: string // Change from string to ObjectId
	createdAt: string
	userName: string
	telegramUserId: string
	contactPhone: string
	deliveryAddress: string
	totalAmount: number
	status: string
	items: OrderItem[]
	paymentReceipt?: PaymentReceipt
	isRead: boolean
}

export default async function OrderDetailPage({
	params,
}: {
	params: { id: string }
}) {
	const order: Order | null = (await getOrderById(params.id)) as Order | null

	if (!order) {
		notFound()
	}

	// Mark order as read if it's not already
	if (!order.isRead) {
		await markAsRead(order?._id)
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

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Link href='/dashboard/orders'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
							<span className='sr-only'>Back</span>
						</Button>
					</Link>
					<h1 className='text-3xl font-bold'>Order Details</h1>
				</div>
				<div className='flex items-center gap-2'>
					{getStatusBadge(order.status)}
				</div>
			</div>

			<div className='grid gap-6 md:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>Order Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='flex items-center gap-4'>
								<div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground'>
									<Package className='h-6 w-6' />
								</div>
								<div>
									<h2 className='text-xl font-semibold'>Order #{order._id}</h2>
									<p className='text-sm text-muted-foreground'>
										{formatDate(order.createdAt)}
									</p>
								</div>
							</div>

							<div className='grid gap-4 pt-4'>
								<div className='flex items-start gap-2'>
									<User className='h-5 w-5 text-muted-foreground' />
									<div>
										<p className='font-medium'>Customer</p>
										<p className='text-sm text-muted-foreground'>
											{order.userName} (ID: {order.telegramUserId})
										</p>
									</div>
								</div>

								<div className='flex items-start gap-2'>
									<Phone className='h-5 w-5 text-muted-foreground' />
									<div>
										<p className='font-medium'>Phone</p>
										<p className='text-sm text-muted-foreground'>
											{order.contactPhone}
										</p>
									</div>
								</div>

								<div className='flex items-start gap-2'>
									<MapPin className='h-5 w-5 text-muted-foreground' />
									<div>
										<p className='font-medium'>Delivery Address</p>
										<p className='text-sm text-muted-foreground'>
											{order.deliveryAddress}
										</p>
									</div>
								</div>

								<div className='flex items-start gap-2'>
									<Calendar className='h-5 w-5 text-muted-foreground' />
									<div>
										<p className='font-medium'>Order Date</p>
										<p className='text-sm text-muted-foreground'>
											{formatDate(order.createdAt)}
										</p>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Payment Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='flex items-center gap-4'>
								<div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground'>
									<DollarSign className='h-6 w-6' />
								</div>
								<div>
									<h2 className='text-xl font-semibold'>
										{order.totalAmount.toLocaleString()} so&apos;m
									</h2>
									<p className='text-sm text-muted-foreground'>
										Status:{' '}
										{order.status.charAt(0).toUpperCase() +
											order.status.slice(1)}
									</p>
								</div>
							</div>

							{order.paymentReceipt ? (
								<div className='pt-4'>
									<div className='flex items-start gap-2'>
										<CreditCard className='h-5 w-5 text-muted-foreground' />
										<div>
											<p className='font-medium'>Payment Receipt</p>
											<p className='text-sm text-muted-foreground'>
												Uploaded: {formatDate(order.paymentReceipt.uploadedAt)}
											</p>
										</div>
									</div>
									<div className='mt-4'>
										<div className='overflow-hidden rounded-md border'>
											<Image
												src={order.paymentReceipt.image || '/placeholder.svg'}
												alt='Payment receipt'
												width={400}
												height={300}
												className='w-full object-contain'
											/>
										</div>
										{order.paymentReceipt.notes && (
											<p className='mt-2 text-sm text-muted-foreground'>
												Notes: {order.paymentReceipt.notes}
											</p>
										)}
									</div>
								</div>
							) : (
								<div className='rounded-md bg-amber-50 p-4'>
									<p className='text-sm text-amber-800'>
										No payment receipt uploaded yet.
									</p>
								</div>
							)}

							<div className='pt-4'>
								<p className='font-medium'>Update Status</p>
								<div className='mt-2 flex flex-wrap gap-2'>
									{[
										'pending',
										'paid',
										'confirmed',
										'shipped',
										'delivered',
										'cancelled',
									].map(status => (
										<Button
											key={status}
											onClick={() => updateOrder(order._id, status)}
											variant={order.status === status ? 'default' : 'outline'}
											size='sm'
										>
											{status.charAt(0).toUpperCase() + status.slice(1)}
										</Button>
									))}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Order Items</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='overflow-hidden rounded-md border'>
						<table className='w-full'>
							<thead>
								<tr className='border-b bg-muted/50'>
									<th className='px-4 py-2 text-left font-medium'>Product</th>
									<th className='px-4 py-2 text-left font-medium'>Price</th>
									<th className='px-4 py-2 text-left font-medium'>Quantity</th>
									<th className='px-4 py-2 text-left font-medium'>Total</th>
								</tr>
							</thead>
							<tbody>
								{order.items.map((item, index) => (
									<tr key={index} className='border-b'>
										<td className='px-4 py-2'>
											<div className='flex items-center gap-2'>
												<div className='h-10 w-10 overflow-hidden rounded-md bg-muted'>
													<Image
														src={item.product.imageUrl || '/placeholder.svg'}
														alt={item.product.name}
														width={40}
														height={40}
														className='h-full w-full object-cover'
													/>
												</div>
												<div>
													<p className='font-medium'>{item.product.name}</p>
												</div>
											</div>
										</td>
										<td className='px-4 py-2'>
											{item.price.toLocaleString()} so&apos;m
										</td>
										<td className='px-4 py-2'>{item.quantity}</td>
										<td className='px-4 py-2'>
											{(item.price * item.quantity).toLocaleString()} so&apos;m
										</td>
									</tr>
								))}
								<tr className='bg-muted/50'>
									<td colSpan={3} className='px-4 py-2 text-right font-medium'>
										Total
									</td>
									<td className='px-4 py-2 font-bold'>
										{order.totalAmount.toLocaleString()} so&apos;m
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
