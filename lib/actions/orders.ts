'use server'

import { updateOrderStatus, markOrderAsRead } from '@/lib/data/orders'
import { revalidatePath } from 'next/cache'

export async function updateOrder(
	orderId: string,
	status: string
): Promise<{ success: string; error?: string | undefined }> {
	try {
		await updateOrderStatus(orderId, status)
		revalidatePath(`/dashboard/orders/${orderId}`)
		revalidatePath('/dashboard/orders')
		return { success: 'true' }
	} catch (error) {
		return {
			success: 'false',
			error: error instanceof Error ? error.message : 'Failed to update order',
		}
	}
}

export async function markAsRead(orderId: string) {
	try {
		await markOrderAsRead(orderId)
		revalidatePath(`/dashboard/orders/${orderId}`)
		revalidatePath('/dashboard/orders')
		return { success: true }
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to mark order as read',
		}
	}
}
