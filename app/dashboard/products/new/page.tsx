'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import { createNewProduct } from '@/lib/actions/products'
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
import { ArrowLeft } from 'lucide-react'

interface Category {
	_id: string
	name: string
}

export default function NewProductPage() {
	const router = useRouter()
	const [categories, setCategories] = useState<Category[]>([])

	const initialState = { message: '', errors: {}, success: undefined }
	const [state, dispatch] = useFormState<any, any>(
		createNewProduct,
		initialState
	)
	console.log(state)
	useEffect(() => {
		async function fetchCategories() {
			try {
				const response = await fetch('/api/categories/all')
				const data = await response.json()
				setCategories(data)
			} catch (error) {
				console.error('Failed to fetch categories:', error)
			}
		}

		fetchCategories()
	}, [])

	useEffect(() => {
		if (state.success) {
			router.push('/dashboard/products')
		}
	}, [state.success, router])

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-2'>
				<Link href='/dashboard/products'>
					<Button variant='ghost' size='icon'>
						<ArrowLeft className='h-4 w-4' />
						<span className='sr-only'>Back</span>
					</Button>
				</Link>
				<h1 className='text-3xl font-bold'>Add New Product</h1>
			</div>

			<form action={dispatch} className='space-y-8'>
				<div className='space-y-4 rounded-md border p-4'>
					<div className='grid gap-4 md:grid-cols-2'>
						<div className='space-y-2'>
							<Label htmlFor='name'>Product Name</Label>
							<Input
								id='name'
								name='name'
								placeholder='Enter product name'
								required
							/>
							{state.errors?.name && (
								<p className='text-sm text-red-500'>{state.errors.name[0]}</p>
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
								placeholder='Enter price'
								required
							/>
							{state.errors?.price && (
								<p className='text-sm text-red-500'>{state.errors.price[0]}</p>
							)}
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='description'>Description</Label>
						<Textarea
							id='description'
							name='description'
							placeholder='Enter product description'
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
							<Select name='category' required>
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
								placeholder='Enter brand name'
								required
							/>
							{state.errors?.brand && (
								<p className='text-sm text-red-500'>{state.errors.brand[0]}</p>
							)}
						</div>
					</div>

					<div className='grid gap-4 md:grid-cols-2'>
						<div className='space-y-2'>
							<Label htmlFor='volume'>Volume</Label>
							<Input
								id='volume'
								name='volume'
								placeholder='e.g. 100ml'
								required
							/>
							{state.errors?.volume && (
								<p className='text-sm text-red-500'>{state.errors.volume[0]}</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='imageUrl'>Image URL</Label>
							<Input
								id='imageUrl'
								name='imageUrl'
								type='url'
								placeholder='Enter image URL'
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
								defaultChecked
							/>
							<Label htmlFor='inStock'></Label>
						</div>

						<div className='flex items-center space-x-2'>
							<Checkbox id='featured' name='featured' value='true' />
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
					<Button type='submit'>Create Product</Button>
					<Link href='/dashboard/products'>
						<Button variant='outline'>Cancel</Button>
					</Link>
				</div>
			</form>
		</div>
	)
}
