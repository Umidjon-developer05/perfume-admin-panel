'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
	LayoutDashboard,
	Users,
	ShoppingBag,
	Tag,
	LogOut,
	Menu,
	X,
	Bell,
	BadgeDollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

interface DashboardShellProps {
	children: React.ReactNode
	unreadOrders: number
}

export function DashboardShell({
	children,
	unreadOrders,
}: DashboardShellProps) {
	const pathname = usePathname()
	const [isMobile, setIsMobile] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}

		checkMobile()
		window.addEventListener('resize', checkMobile)

		return () => {
			window.removeEventListener('resize', checkMobile)
		}
	}, [])

	const navigation = [
		{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
		{ name: 'Users', href: '/dashboard/users', icon: Users },
		{
			name: 'Orders',
			href: '/dashboard/orders',
			icon: ShoppingBag,
			badge: unreadOrders > 0 ? unreadOrders : undefined,
		},
		{ name: 'Products', href: '/dashboard/products', icon: ShoppingBag },
		{ name: 'Categories', href: '/dashboard/categories', icon: Tag },
		{
			name: 'PaymentOut',
			href: '/dashboard/payment-out',
			icon: BadgeDollarSign,
		},
	]

	const NavLinks = () => (
		<nav className='flex flex-col gap-2'>
			{navigation.map(item => {
				const isActive =
					pathname === item.href || pathname.startsWith(`${item.href}/`)

				return (
					<Link
						key={item.name}
						href={item.href}
						className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
							isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
						}`}
						onClick={() => setIsOpen(false)}
					>
						<item.icon className='h-5 w-5' />
						<span>{item.name}</span>
						{item.badge && (
							<Badge variant='destructive' className='ml-auto'>
								{item.badge}
							</Badge>
						)}
					</Link>
				)
			})}
		</nav>
	)

	return (
		<div className='flex min-h-screen'>
			{/* Sidebar for desktop */}
			{!isMobile && (
				<div className='w-64 border-r bg-background p-6'>
					<div className='flex h-full flex-col justify-between'>
						<div className='space-y-6'>
							<div className='flex items-center gap-2'>
								<ShoppingBag className='h-6 w-6' />
								<h1 className='text-xl font-bold'>Atir Market</h1>
							</div>
							<NavLinks />
						</div>
						<Button
							variant='outline'
							className='justify-start gap-2'
							onClick={() => signOut({ callbackUrl: '/login' })}
						>
							<LogOut className='h-4 w-4' />
							<span>Log out</span>
						</Button>
					</div>
				</div>
			)}

			{/* Mobile sidebar */}
			{isMobile && (
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='md:hidden fixed top-4 left-4 z-50'
						>
							<Menu className='h-5 w-5' />
							<span className='sr-only'>Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side='left' className='w-64 p-6'>
						<div className='flex h-full flex-col justify-between'>
							<div className='space-y-6'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<ShoppingBag className='h-6 w-6' />
										<h1 className='text-xl font-bold'>Atir Market</h1>
									</div>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => setIsOpen(false)}
									>
										<X className='h-5 w-5' />
										<span className='sr-only'>Close menu</span>
									</Button>
								</div>
								<NavLinks />
							</div>
							<Button
								variant='outline'
								className='justify-start gap-2'
								onClick={() => signOut({ callbackUrl: '/login' })}
							>
								<LogOut className='h-4 w-4' />
								<span>Log out</span>
							</Button>
						</div>
					</SheetContent>
				</Sheet>
			)}

			{/* Main content */}
			<div className='flex-1 overflow-auto'>
				{isMobile && (
					<div className='h-16 border-b flex items-center justify-center relative'>
						<div className='flex items-center gap-2'>
							<ShoppingBag className='h-5 w-5' />
							<h1 className='text-lg font-bold'>Atir Market</h1>
						</div>
						{unreadOrders > 0 && (
							<Link href='/dashboard/orders' className='absolute right-4'>
								<Button variant='ghost' size='icon' className='relative'>
									<Bell className='h-5 w-5' />
									<Badge
										variant='destructive'
										className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0'
									>
										{unreadOrders}
									</Badge>
								</Button>
							</Link>
						)}
					</div>
				)}
				<main className='p-6'>{children}</main>
			</div>
		</div>
	)
}
