'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Category {
	_id: string
	name: string
	description?: string
	imageUrl?: string
	productCount: number
}

export default function CategoriesPage() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const [categories, setCategories] = useState<Category[]>([])
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

		async function fetchCategories() {
			try {
				const response = await fetch(
					`/api/categories?page=${page}&limit=${limit}&search=${search}`
				)
				const data = await response.json()
				setCategories(data.categories)
				setPagination(data.pagination)
			} catch (error) {
				console.error('Failed to fetch categories:', error)
			}
		}

		fetchCategories()
	}, [searchParams])

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', page.toString())
		router.push(`/dashboard/categories?${params.toString()}`)
	}

	const handleLimitChange = (limit: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('limit', limit.toString())
		params.set('page', '1')
		router.push(`/dashboard/categories?${params.toString()}`)
	}

	const handleSearch = (search: string) => {
		const params = new URLSearchParams(searchParams)
		if (search) {
			params.set('search', search)
		} else {
			params.delete('search')
		}
		params.set('page', '1')
		router.push(`/dashboard/categories?${params.toString()}`)
	}

	const columns = [
		{
			header: 'Category',
			accessorKey: 'category',
			cell: (category: Category) => (
				<div className='flex items-center gap-2'>
					{category.imageUrl && (
						<div className='h-10 w-10 overflow-hidden rounded-md bg-muted'>
							<Image
								src={category.imageUrl || '/placeholder.svg'}
								alt={category.name}
								width={40}
								height={40}
								className='h-full w-full object-cover'
							/>
						</div>
					)}
					<div>
						<p className='font-medium'>{category.name}</p>
						{category.description && (
							<p className='text-sm text-muted-foreground'>
								{category.description.length > 50
									? `${category.description.substring(0, 50)}...`
									: category.description}
							</p>
						)}
					</div>
				</div>
			),
		},
		{
			header: 'Products',
			accessorKey: 'productCount',
			cell: (category: Category) => (
				<Badge variant='outline'>{category.productCount} products</Badge>
			),
		},
		{
			header: 'Actions',
			accessorKey: 'actions',
			cell: (category: Category) => (
				<div className='flex items-center gap-2'>
					<Badge
						variant='outline'
						className='cursor-pointer'
						onClick={() => router.push(`/dashboard/categories/${category._id}`)}
					>
						Edit
					</Badge>
					<Link href={`/dashboard/products?category=${category._id}`}>
						<Badge variant='secondary' className='cursor-pointer'>
							View Products
						</Badge>
					</Link>
				</div>
			),
		},
	]

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-bold'>Categories</h1>
				<Link href='/dashboard/categories/new'>
					<Button className='gap-2'>
						<Plus className='h-4 w-4' />
						<span>Add Category</span>
					</Button>
				</Link>
			</div>

			<DataTable
				data={categories}
				columns={columns}
				pagination={pagination}
				onPageChange={handlePageChange}
				onLimitChange={handleLimitChange}
				onSearch={handleSearch}
				searchPlaceholder='Search categories...'
			/>
		</div>
	)
}
