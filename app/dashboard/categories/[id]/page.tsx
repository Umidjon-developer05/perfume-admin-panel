'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import {
	updateExistingCategory,
	deleteExistingCategory,
	type FormState,
} from '@/lib/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
	description?: string
	imageUrl?: string
}

export default function EditCategoryPage({
	params,
}: {
	params: { id: string }
}) {
	const router = useRouter()
	const [category, setCategory] = useState<Category | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Define the initial state with all required properties
	const initialState: FormState = {
		message: null,
		errors: {},
		success: false,
	}

	// Create a bound version of the server action with the ID parameter
	const updateCategoryWithId = updateExistingCategory.bind(null, params.id)

	// Use the useFormState hook with the bound action
	const [state, dispatch] = useFormState(updateCategoryWithId, initialState)

	useEffect(() => {
		async function fetchCategory() {
			try {
				const response = await fetch(`/api/categories/${params.id}`)
				if (!response.ok) {
					throw new Error('Category not found')
				}
				const data = await response.json()
				setCategory(data)
			} catch (error) {
				console.error('Failed to fetch category:', error)
				setError('Failed to fetch category')
			} finally {
				setLoading(false)
			}
		}

		fetchCategory()
	}, [params.id])

	useEffect(() => {
		if (state.success) {
			router.push('/dashboard/categories')
		}
	}, [state.success, router])

	const handleDelete = async () => {
		try {
			const result = await deleteExistingCategory(params.id)
			if (result.success) {
				router.push('/dashboard/categories')
			} else {
				setError(result.error || 'Failed to delete category')
			}
		} catch (error) {
			console.error('Failed to delete category:', error)
			setError('Failed to delete category')
		}
	}

	if (loading) {
		return <div>Loading...</div>
	}

	if (error) {
		return (
			<div className='space-y-6'>
				<div className='flex items-center gap-2'>
					<Link href='/dashboard/categories'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
							<span className='sr-only'>Back</span>
						</Button>
					</Link>
					<h1 className='text-3xl font-bold'>Error</h1>
				</div>
				<div className='rounded-md bg-red-50 p-4'>
					<p className='text-sm text-red-500'>{error}</p>
				</div>
				<Link href='/dashboard/categories'>
					<Button>Back to Categories</Button>
				</Link>
			</div>
		)
	}

	if (!category) {
		return <div>Category not found</div>
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Link href='/dashboard/categories'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
							<span className='sr-only'>Back</span>
						</Button>
					</Link>
					<h1 className='text-3xl font-bold'>Edit Category</h1>
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
								category from the database. Make sure there are no products
								associated with this category before deleting.
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
				{category.imageUrl && (
					<div className='md:col-span-1'>
						<div className='overflow-hidden rounded-md border'>
							<Image
								src={category.imageUrl || '/placeholder.svg'}
								alt={category.name}
								width={400}
								height={400}
								className='w-full object-cover'
							/>
						</div>
					</div>
				)}

				<div className={category.imageUrl ? 'md:col-span-2' : 'md:col-span-3'}>
					<form action={dispatch} className='space-y-8'>
						<div className='space-y-4 rounded-md border p-4'>
							<div className='space-y-2'>
								<Label htmlFor='name'>Category Name</Label>
								<Input
									id='name'
									name='name'
									defaultValue={category.name}
									required
								/>
								{state.errors?.name && (
									<p className='text-sm text-red-500'>{state.errors.name[0]}</p>
								)}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='description'>Description</Label>
								<Textarea
									id='description'
									name='description'
									defaultValue={category.description || ''}
									rows={4}
								/>
								{state.errors?.description && (
									<p className='text-sm text-red-500'>
										{state.errors.description[0]}
									</p>
								)}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='imageUrl'>Image URL</Label>
								<Input
									id='imageUrl'
									name='imageUrl'
									type='url'
									defaultValue={category.imageUrl || ''}
								/>
								{state.errors?.imageUrl && (
									<p className='text-sm text-red-500'>
										{state.errors.imageUrl[0]}
									</p>
								)}
							</div>
						</div>

						{state.message && !state.success && (
							<div className='rounded-md bg-red-50 p-4'>
								<p className='text-sm text-red-500'>{state.message}</p>
							</div>
						)}

						<div className='flex items-center gap-4'>
							<Button type='submit'>Update Category</Button>
							<Link href='/dashboard/categories'>
								<Button variant='outline'>Cancel</Button>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
