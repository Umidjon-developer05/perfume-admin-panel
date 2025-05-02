'use server'

import {
	createCategory,
	updateCategory,
	deleteCategory,
} from '@/lib/data/categories'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const CategorySchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	imageUrl: z.string().url('Image URL must be a valid URL').optional(),
})

export interface FormState {
	message: string | null
	errors: {
		name?: string[]
		description?: string[]
		imageUrl?: string[]
	}
	success: boolean // Note: This must always be defined
}

// ✅ Server Action bu yerda `async` bo'lishi kerak
export const createCategoryAction = async (
	state: FormState,
	formData: FormData
): Promise<FormState> => {
	return await createNewCategory(formData)
}

// Qolgan yordamchi funksiyalar
export async function createNewCategory(
	formData: FormData
): Promise<FormState> {
	const validatedFields = CategorySchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description'),
		imageUrl: formData.get('imageUrl'),
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid fields. Failed to create category.',
			success: false,
		}
	}

	const categoryData = validatedFields.data

	try {
		await createCategory(categoryData)
		revalidatePath('/dashboard/categories')
		return {
			message: '',
			errors: {},
			success: true,
		}
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to create category',
			errors: {},
		}
	}
}

export async function updateExistingCategory(
	id: string,
	prevState: FormState,
	formData: FormData
): Promise<FormState> {
	const validatedFields = CategorySchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description'),
		imageUrl: formData.get('imageUrl'),
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid fields. Failed to update category.',
			success: false,
		}
	}

	const categoryData = validatedFields.data

	try {
		await updateCategory(id, categoryData)
		revalidatePath(`/dashboard/categories/${id}`)
		revalidatePath('/dashboard/categories')
		return {
			message: '',
			errors: {},
			success: true,
		}
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to update category',
			errors: {},
		}
	}
}

export async function deleteExistingCategory(id: string) {
	try {
		await deleteCategory(id)
		revalidatePath('/dashboard/categories')
		return { success: true }
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to delete category',
		}
	}
}
