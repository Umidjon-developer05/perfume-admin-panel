'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Product {
	_id: string
	name: string
	description: string
	price: number
	imageUrl: string
	category: {
		_id: string
		name: string
	}
	inStock: boolean
	brand: string
	volume: string
	featured: boolean
	createdAt: string
}

interface Cat {
	_id: string
	name: string
}
export default function ProductsPage() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const [products, setProducts] = useState<Product[]>([])
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 1,
	})
	const [category, setCategory] = useState('')
	const [categories, setCategories] = useState<
		{ label: string; value: string }[]
	>([])

	useEffect(() => {
		const page = Number(searchParams.get('page') || 1)
		const limit = Number(searchParams.get('limit') || 10)
		const search = searchParams.get('search') || ''
		const category = searchParams.get('category') || ''

		setCategory(category)

		async function fetchProducts() {
			try {
				const response = await fetch(
					`/api/products?page=${page}&limit=${limit}&search=${search}&category=${category}`
				)
				const data = await response.json()
				setProducts(data?.products)
				setPagination(data?.pagination)
			} catch (error) {
				console.error('Failed to fetch products:', error)
			}
		}

		async function fetchCategories() {
			try {
				const response = await fetch('/api/categories/all')
				const data = await response.json()
				setCategories(
					data.map((cat: Cat) => ({
						label: cat.name,
						value: cat._id,
					}))
				)
			} catch (error) {
				console.error('Failed to fetch categories:', error)
			}
		}

		fetchProducts()
		fetchCategories()
	}, [searchParams])

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', page.toString())
		router.push(`/dashboard/products?${params.toString()}`)
	}

	const handleLimitChange = (limit: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('limit', limit.toString())
		params.set('page', '1')
		router.push(`/dashboard/products?${params.toString()}`)
	}

	const handleSearch = (search: string) => {
		const params = new URLSearchParams(searchParams)
		if (search) {
			params.set('search', search)
		} else {
			params.delete('search')
		}
		params.set('page', '1')
		router.push(`/dashboard/products?${params.toString()}`)
	}

	const handleCategoryChange = (category: string) => {
		const params = new URLSearchParams(searchParams)
		if (category) {
			params.set('category', category)
		} else {
			params.delete('category')
		}
		params.set('page', '1')
		router.push(`/dashboard/products?${params.toString()}`)
	}

	const columns = [
		{
			header: 'Product',
			accessorKey: 'product',
			cell: (product: Product) => (
				<div className='flex items-center gap-2' key={product._id}>
					<div className='h-10 w-10 overflow-hidden rounded-md bg-muted'>
						<Image
							src={product.imageUrl || '/placeholder.svg'}
							alt={product.name}
							width={40}
							height={40}
							className='h-full w-full object-cover'
						/>
					</div>
					<div>
						<p className='font-medium'>{product.name}</p>
						<p className='text-sm text-muted-foreground'>
							{product.brand} - {product.volume}
						</p>
					</div>
				</div>
			),
		},
		{
			header: 'Category',
			accessorKey: 'category',
			cell: (product: Product) => product.category?.name || 'Uncategorized',
		},
		{
			header: 'Price',
			accessorKey: 'price',
			cell: (product: Product) => (
				<span className='font-medium' key={product._id}>
					{product.price.toLocaleString()} so&apos;m
				</span>
			),
		},
		{
			header: 'Status',
			accessorKey: 'status',
			cell: (product: Product) => (
				<div className='flex flex-col gap-1' key={product._id}>
					{product.inStock ? (
						<Badge variant='outline' className='bg-green-50'>
							In Stock
						</Badge>
					) : (
						<Badge variant='outline' className='bg-red-50'>
							Out of Stock
						</Badge>
					)}
					{product.featured && <Badge variant='secondary'>Featured</Badge>}
				</div>
			),
		},
		{
			header: 'Actions',
			accessorKey: 'actions',
			cell: (product: Product) => (
				<div className='flex items-center gap-2' key={product._id}>
					<Badge
						variant='outline'
						className='cursor-pointer'
						onClick={() => router.push(`/dashboard/products/${product._id}`)}
					>
						Edit
					</Badge>
				</div>
			),
		},
	]
	console.log(columns)
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-bold'>Products</h1>
				<Link href='/dashboard/products/new'>
					<Button className='gap-2'>
						<Plus className='h-4 w-4' />
						<span>Add Product</span>
					</Button>
				</Link>
			</div>

			<DataTable
				data={products}
				columns={columns}
				pagination={pagination}
				onPageChange={handlePageChange}
				onLimitChange={handleLimitChange}
				onSearch={handleSearch}
				searchPlaceholder='Search products...'
				filters={[
					{
						name: 'Category',
						options: categories,
						value: category,
						onChange: handleCategoryChange,
					},
				]}
			/>
		</div>
	)
}
