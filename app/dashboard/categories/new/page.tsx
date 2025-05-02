'use client'

import { useRouter } from 'next/navigation'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import { createCategoryAction } from '@/lib/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'

// State interfeyslarini aniqlash
interface CategoryFormState {
	message: string
	errors: {
		name?: string[]
		description?: string[]
		imageUrl?: string[]
	}
	success: boolean
}

export default function NewCategoryPage() {
	const router = useRouter()

	const initialState: CategoryFormState = {
		message: '',
		errors: {},
		success: false,
	}
	const [state, dispatch] = useFormState(createCategoryAction, initialState)

	useEffect(() => {
		if (state.success) {
			router.push('/dashboard/categories')
		}
	}, [state.success, router])

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-2'>
				<Link href='/dashboard/categories'>
					<Button variant='ghost' size='icon'>
						<ArrowLeft className='h-4 w-4' />
						<span className='sr-only'>Back</span>
					</Button>
				</Link>
				<h1 className='text-3xl font-bold'>Add New Category</h1>
			</div>

			<form action={dispatch} className='space-y-8'>
				<div className='space-y-4 rounded-md border p-4'>
					<div className='space-y-2'>
						<Label htmlFor='name'>Category Name</Label>
						<Input
							id='name'
							name='name'
							placeholder='Enter category name'
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
							placeholder='Enter category description (optional)'
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
							placeholder='Enter image URL (optional)'
						/>
						{state.errors?.imageUrl && (
							<p className='text-sm text-red-500'>{state.errors.imageUrl[0]}</p>
						)}
					</div>
				</div>

				{state.message && !state.success && (
					<div className='rounded-md bg-red-50 p-4'>
						<p className='text-sm text-red-500'>{state.message}</p>
					</div>
				)}

				<div className='flex items-center gap-4'>
					<Button type='submit'>Create Category</Button>
					<Link href='/dashboard/categories'>
						<Button variant='outline'>Cancel</Button>
					</Link>
				</div>
			</form>
		</div>
	)
}
