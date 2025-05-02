// components/OrderStatusButtons.tsx
'use client'

import { Button } from '@/components/ui/button'
import { updateOrder } from '@/lib/actions/orders'

interface Props {
	currentStatus: string
	orderId: string
}

export default function OrderStatusButtons({ currentStatus, orderId }: Props) {
	const statuses = [
		'Kutilmoqda',
		'Tolov qilingan',
		'Tasdiqlangan',
		"Jo'natilgan",
		'Yetkazilayapti',
		'Bekor qilingan',
	]

	return (
		<div className='mt-2 flex flex-wrap gap-2'>
			{statuses.map(status => (
				<Button
					key={status}
					onClick={() => updateOrder(orderId, status)}
					variant={currentStatus === status ? 'default' : 'outline'}
					size='sm'
				>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</Button>
			))}
		</div>
	)
}
