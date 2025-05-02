'use server'

import AuthError from 'next-auth'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { signIn } from 'next-auth/react'

const LoginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormState = {
	errors?: {
		email?: string[]
		password?: string[]
	}
	message?: string
}

export async function login(
	prevState: LoginFormState,
	formData: FormData
): Promise<LoginFormState> {
	const validatedFields = LoginSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid fields. Failed to log in.',
		}
	}

	const { email, password } = validatedFields.data
	console.log(email, password)
	try {
		await signIn('credentials', {
			email,
			password,
			redirect: false,
		})
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error) {
				case 'CredentialsSignin':
					return { message: 'Invalid credentials.' }
				default:
					return { message: 'Something went wrong.' }
			}
		}
		throw error
	}

	redirect('/dashboard')
}
