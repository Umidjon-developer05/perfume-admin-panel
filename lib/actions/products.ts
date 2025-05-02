'use server'

import {
	createProduct,
	updateProduct,
	deleteProduct,
} from '@/lib/data/products'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
type FormState = {
	message: string
	errors: {
		name?: string[]
		description?: string[]
		price?: string[]
		imageUrl?: string[]
		category?: string[]
		inStock?: string[]
		brand?: string[]
		volume?: string[]
		featured?: string[]
	}
	success: boolean
}

const ProductSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.coerce.number().min(0, 'Price must be a positive number'),
	imageUrl: z.string().url('Image URL must be a valid URL'),
	category: z.string().min(1, 'Category is required'),
	brand: z.string().min(1, 'Brand is required'),
	volume: z.string().min(1, 'Volume is required'),
	inStock: z.boolean().default(true),
	featured: z.boolean().default(false),
})

export async function createNewProduct(
	prevState: FormState,
	formData: FormData
) {
	const validatedFields = ProductSchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description'),
		price: formData.get('price'),
		imageUrl: formData.get('imageUrl'),
		category: formData.get('category'),
		brand: formData.get('brand'),
		volume: formData.get('volume'),
		inStock: formData.get('inStock') === 'true',
		featured: formData.get('featured') === 'true',
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid fields. Failed to create product.',
		}
	}

	const productData = validatedFields.data

	try {
		await createProduct(productData)
		revalidatePath('/dashboard/products')
		return { success: true }
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to create product',
		}
	}
}

export async function updateExistingProduct(
	id: string,
	prevState: FormState,
	formData: FormData
) {
	const validatedFields = ProductSchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description'),
		price: formData.get('price'),
		imageUrl: formData.get('imageUrl'),
		category: formData.get('category'),
		brand: formData.get('brand'),
		volume: formData.get('volume'),
		inStock: formData.get('inStock') === 'true',
		featured: formData.get('featured') === 'true',
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid fields. Failed to update product.',
		}
	}

	const productData = validatedFields.data

	try {
		await updateProduct(id, productData)
		revalidatePath(`/dashboard/products/${id}`)
		revalidatePath('/dashboard/products')
		return { success: true }
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to update product',
		}
	}
}

export async function deleteExistingProduct(id: string) {
	try {
		await deleteProduct(id)
		revalidatePath('/dashboard/products')
		return { success: true }
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to delete product',
		}
	}
}
