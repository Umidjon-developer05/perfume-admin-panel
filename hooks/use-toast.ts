'use client'

// This is a simplified version of the shadcn/ui toast hook
import { useState, useCallback } from 'react'

type ToastProps = {
	id?: string
	title?: string
	description?: string
	duration?: number
	variant?: 'default' | 'destructive'
}

type ToastState = {
	toasts: ToastProps[]
}

export function useToast() {
	const [state, setState] = useState<ToastState>({ toasts: [] })

	const toast = useCallback(
		({
			id = String(Date.now()),
			title,
			description,
			duration = 5000,
			variant = 'default',
		}: ToastProps) => {
			setState(prev => ({
				toasts: [...prev.toasts, { id, title, description, duration, variant }],
			}))

			if (duration > 0) {
				setTimeout(() => {
					setState(prev => ({
						toasts: prev.toasts.filter(toast => toast.id !== id),
					}))
				}, duration)
			}

			return {
				id,
				dismiss: () =>
					setState(prev => ({
						toasts: prev.toasts.filter(toast => toast.id !== id),
					})),
				update: (props: ToastProps) =>
					setState(prev => ({
						toasts: prev.toasts.map(t =>
							t.id === id ? { ...t, ...props } : t
						),
					})),
			}
		},
		[]
	)

	const dismiss = useCallback((toastId?: string) => {
		setState(prev => ({
			toasts: toastId ? prev.toasts.filter(toast => toast.id !== toastId) : [],
		}))
	}, [])

	return {
		toast,
		dismiss,
		toasts: state.toasts,
	}
}
