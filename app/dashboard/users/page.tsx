'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface User {
	_id: string
	telegramId: string
	username?: string
	firstName?: string
	lastName?: string
	phoneNumber?: string
	referralCount: number
	referralBonus: number
	createdAt: string
}

export default function UsersPage() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const [users, setUsers] = useState<User[]>([])
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 1,
	})

	useEffect(() => {
		const page = Number(searchParams.get('page') || 1)
		const limit = Number(searchParams.get('limit') || 10)
		const search = searchParams.get('search') || ''

		async function fetchUsers() {
			try {
				const response = await fetch(
					`/api/users?page=${page}&limit=${limit}&search=${search}`
				)
				const data = await response.json()
				setUsers(data.users)
				setPagination(data.pagination)
			} catch (error) {
				console.error('Failed to fetch users:', error)
			}
		}

		fetchUsers()
	}, [searchParams])

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', page.toString())
		router.push(`/dashboard/users?${params.toString()}`)
	}

	const handleLimitChange = (limit: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('limit', limit.toString())
		params.set('page', '1')
		router.push(`/dashboard/users?${params.toString()}`)
	}

	const handleSearch = (search: string) => {
		const params = new URLSearchParams(searchParams)
		if (search) {
			params.set('search', search)
		} else {
			params.delete('search')
		}
		params.set('page', '1')
		router.push(`/dashboard/users?${params.toString()}`)
	}

	const columns = [
		{
			header: 'User',
			accessorKey: 'name',
			cell: (user: User) => (
				<div className='flex flex-col'>
					<span className='font-medium'>
						{user.firstName || user.username || 'Unknown User'}
					</span>
					<span className='text-sm text-muted-foreground'>
						ID: {user.telegramId}
					</span>
				</div>
			),
		},
		{
			header: 'Contact',
			accessorKey: 'contact',
			cell: (user: User) => (
				<div className='flex flex-col'>
					{user.phoneNumber ? (
						<span>{user.phoneNumber}</span>
					) : (
						<span className='text-muted-foreground'>No phone</span>
					)}
					{user.username && (
						<span className='text-sm text-muted-foreground'>
							@{user.username}
						</span>
					)}
				</div>
			),
		},
		{
			header: 'Referrals',
			accessorKey: 'referrals',
			cell: (user: User) => (
				<div className='flex flex-col'>
					<span>{user.referralCount} users</span>
					{user.referralBonus > 0 && (
						<span className='text-sm text-green-600'>
							{user.referralBonus.toLocaleString()} so&apos;m bonus
						</span>
					)}
				</div>
			),
		},
		{
			header: 'Joined',
			accessorKey: 'createdAt',
			cell: (user: User) => formatDate(user.createdAt),
		},
		{
			header: 'Actions',
			accessorKey: 'actions',
			cell: (user: User) => (
				<div className='flex items-center gap-2'>
					<Badge
						variant='outline'
						className='cursor-pointer'
						onClick={() => router.push(`/dashboard/users/${user.telegramId}`)}
					>
						View
					</Badge>
				</div>
			),
		},
	]

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-bold'>Users</h1>
			</div>

			<DataTable
				data={users}
				columns={columns}
				pagination={pagination}
				onPageChange={handlePageChange}
				onLimitChange={handleLimitChange}
				onSearch={handleSearch}
				searchPlaceholder='Search users...'
			/>
		</div>
	)
}
