'use client'

import type React from 'react'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShoppingBag } from 'lucide-react'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false,
			})

			if (result?.error) {
				setError('Invalid credentials.')
			} else {
				window.location.href = '/dashboard'
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md space-y-8'>
				<div className='text-center'>
					<div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary'>
						<ShoppingBag className='h-6 w-6 text-blue-700' />
					</div>
					<h2 className='mt-6 text-3xl font-bold tracking-tight'>
						Atir Market Admin
					</h2>
					<p className='mt-2 text-sm text-gray-600'>
						Sign in to access the admin dashboard
					</p>
				</div>
				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					<div className='space-y-4 rounded-md shadow-sm'>
						<div>
							<Label htmlFor='email'>Email address</Label>
							<Input
								id='email'
								name='email'
								type='email'
								autoComplete='email'
								required
								className='mt-1'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								name='password'
								type='password'
								autoComplete='current-password'
								required
								className='mt-1'
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
						</div>
					</div>

					{error && (
						<div className='rounded-md bg-red-50 p-4'>
							<p className='text-sm text-red-500'>{error}</p>
						</div>
					)}

					<Button type='submit' className='w-full' disabled={loading}>
						{loading ? (
							<>
								<svg
									className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
									></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
									></path>
								</svg>
								Signing in...
							</>
						) : (
							'Sign in'
						)}
					</Button>
				</form>
			</div>
		</div>
	)
}
