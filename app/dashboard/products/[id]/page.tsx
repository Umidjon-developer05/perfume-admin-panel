'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import {
	updateExistingProduct,
	deleteExistingProduct,
} from '@/lib/actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Trash } from 'lucide-react'

interface Category {
	_id: string
	name: string
}

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
}
type FormState = {
	message: string
	success: boolean
	errors: {
		name?: string[]
		description?: string[]
		price?: string[]
		imageUrl?: string[]
		category?: string[]
		brand?: string[]
		volume?: string[]
		inStock?: string[]
		featured?: string[]
	}
}

export default function EditProductPage({
	params,
}: {
	params: { id: string }
}) {
	const router = useRouter()
	const [product, setProduct] = useState<Product | null>(null)
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)

	const initialState: FormState = {
		message: '',
		errors: {},
		success: false,
	}

	const [state, dispatch] = useFormState<any, any>(
		updateExistingProduct.bind(null, params.id),
		initialState
	)

	useEffect(() => {
		async function fetchProduct() {
			try {
				const response = await fetch(`/api/products/${params.id}`)
				if (!response.ok) {
					throw new Error('Product not found')
				}
				const data = await response.json()
				setProduct(data)
			} catch (error) {
				console.error('Failed to fetch product:', error)
				router.push('/dashboard/products')
			}
		}

		async function fetchCategories() {
			try {
				const response = await fetch('/api/categories/all')
				const data = await response.json()
				setCategories(data)
			} catch (error) {
				console.error('Failed to fetch categories:', error)
			}
		}

		Promise.all([fetchProduct(), fetchCategories()]).finally(() =>
			setLoading(false)
		)
	}, [params.id, router])

	useEffect(() => {
		if (state.success) {
			router.push('/dashboard/products')
		}
	}, [state.success, router])

	const handleDelete = async () => {
		const result = await deleteExistingProduct(params.id)
		if (result.success) {
			router.push('/dashboard/products')
		}
	}

	if (loading) {
		return <div>Loading...</div>
	}

	if (!product) {
		return <div>Product not found</div>
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Link href='/dashboard/products'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
							<span className='sr-only'>Back</span>
						</Button>
					</Link>
					<h1 className='text-3xl font-bold'>Edit Product</h1>
				</div>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant='destructive' size='sm'>
							<Trash className='mr-2 h-4 w-4' />
							Delete
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the
								product from the database.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={handleDelete}>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

			<div className='grid gap-6 md:grid-cols-3'>
				<div className='md:col-span-1'>
					<div className='overflow-hidden rounded-md border'>
						<Image
							src={product.imageUrl || '/placeholder.svg'}
							alt={product.name}
							width={400}
							height={400}
							className='w-full object-cover'
						/>
					</div>
				</div>

				<div className='md:col-span-2'>
					<form action={dispatch} className='space-y-8'>
						<div className='space-y-4 rounded-md border p-4'>
							<div className='grid gap-4 md:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='name'>Product Name</Label>
									<Input
										id='name'
										name='name'
										defaultValue={product.name}
										required
									/>
									{state.errors?.name && (
										<p className='text-sm text-red-500'>
											{state.errors.name[0]}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='price'>Price (so&apos;m)</Label>
									<Input
										id='price'
										name='price'
										type='number'
										min='0'
										step='1000'
										defaultValue={product.price}
										required
									/>
									{state.errors?.price && (
										<p className='text-sm text-red-500'>
											{state.errors.price[0]}
										</p>
									)}
								</div>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='description'>Description</Label>
								<Textarea
									id='description'
									name='description'
									defaultValue={product.description}
									rows={4}
									required
								/>
								{state.errors?.description && (
									<p className='text-sm text-red-500'>
										{state.errors.description[0]}
									</p>
								)}
							</div>

							<div className='grid gap-4 md:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='category'>Category</Label>
									<Select
										name='category'
										defaultValue={product.category._id}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder='Select a category' />
										</SelectTrigger>
										<SelectContent>
											{categories.map(category => (
												<SelectItem key={category._id} value={category._id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{state.errors?.category && (
										<p className='text-sm text-red-500'>
											{state.errors.category[0]}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='brand'>Brand</Label>
									<Input
										id='brand'
										name='brand'
										defaultValue={product.brand}
										required
									/>
									{state.errors?.brand && (
										<p className='text-sm text-red-500'>
											{state.errors.brand[0]}
										</p>
									)}
								</div>
							</div>

							<div className='grid gap-4 md:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='volume'>Volume</Label>
									<Input
										id='volume'
										name='volume'
										defaultValue={product.volume}
										required
									/>
									{state.errors?.volume && (
										<p className='text-sm text-red-500'>
											{state.errors.volume[0]}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='imageUrl'>Image URL</Label>
									<Input
										id='imageUrl'
										name='imageUrl'
										type='url'
										defaultValue={product.imageUrl}
										required
									/>
									{state.errors?.imageUrl && (
										<p className='text-sm text-red-500'>
											{state.errors.imageUrl[0]}
										</p>
									)}
								</div>
							</div>

							<div className='grid gap-4 md:grid-cols-2'>
								<div className='flex items-center space-x-2'>
									<Checkbox
										id='inStock'
										name='inStock'
										value='true'
										defaultChecked={product.inStock}
									/>
									<Label htmlFor='inStock'>In Stock</Label>
								</div>

								<div className='flex items-center space-x-2'>
									<Checkbox
										id='featured'
										name='featured'
										value='true'
										defaultChecked={product.featured}
									/>
									<Label htmlFor='featured'>Featured Product</Label>
								</div>
							</div>
						</div>

						{state.message && !state.success && (
							<div className='rounded-md bg-red-50 p-4'>
								<p className='text-sm text-red-500'>{state.message}</p>
							</div>
						)}

						<div className='flex items-center gap-4'>
							<Button type='submit'>Update Product</Button>
							<Link href='/dashboard/products'>
								<Button variant='outline'>Cancel</Button>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
