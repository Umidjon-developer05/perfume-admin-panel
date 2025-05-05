// components/OrderStatusButtons.tsx
'use client'

import { Button } from '@/components/ui/button'
import { updateOrder } from '@/lib/actions/orders'

interface Props {
	currentStatus: string
	orderId: string
	telegramUserId: string
}

export default function OrderStatusButtons({
	currentStatus,
	orderId,
	telegramUserId,
}: Props) {
	const statuses = [
		'Kutilmoqda',
		'Tolov qilingan',
		'Tasdiqlangan',
		"Jo'natilgan",
		'Yetkazilayapti',
		'Bekor qilingan',
	]
	const UpdateOrder = async (status: string) => {
		await updateOrder(orderId, status)

		let message = ''
		switch (status) {
			case 'Kutilmoqda':
				message =
					'📦 Buyurtmangiz holati: Kutilmoqda. Tez orada ko‘rib chiqiladi.'
				break
			case 'Tolov qilingan':
				message = '💰 To‘lov muvaffaqiyatli amalga oshirildi. Rahmat!'
				break
			case 'Tasdiqlangan':
				message = '✅ Buyurtmangiz tasdiqlandi. Tayyorlanmoqda.'
				break
			case "Jo'natilgan":
				message = '🚚 Buyurtmangiz jo‘natildi. Yaqinda yetib boradi.'
				break
			case 'Yetkazilayapti':
				message = '📦 Buyurtmangiz yetkazilmoqda. Iltimos, tayyor bo‘ling.'
				break
			case 'Bekor qilingan':
				message =
					'❌ Buyurtmangiz bekor qilindi. Qo‘shimcha ma’lumot uchun biz bilan bog‘laning.'
				break
			default:
				message = `Buyurtma holati yangilandi: ${status}`
		}

		const res = await fetch(
			`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: telegramUserId,
					text: message,
				}),
			}
		)
		if (!res.ok) {
			throw new Error('Failed to send Telegram message')
		}
	}

	return (
		<div className='mt-2 flex flex-wrap gap-2'>
			{statuses.map(status => (
				<Button
					key={status}
					onClick={() => UpdateOrder(status)}
					variant={currentStatus === status ? 'default' : 'outline'}
					size='sm'
				>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</Button>
			))}
		</div>
	)
}
