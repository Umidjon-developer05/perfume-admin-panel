'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Upload, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// import { useToast } from "@/hooks/use-toast"

export default function PaymentOutID() {
	const { id } = useParams()
	const [image, setImage] = useState<File | null>(null)
	const [data, setData] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isUploading, setIsUploading] = useState(false)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	// const { toast } = useToast()
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)
				const res = await fetch(`/api/check`)

				if (!res.ok) throw new Error('Failed to fetch data')
				const data = await res.json()
				console.log(data)
				setData(Array.isArray(data) ? data : [])
			} catch (err) {
				setError('Failed to load payment history')
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [id])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setImage(file)

			// Create preview URL
			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const handleSubmit = async () => {
		if (!image) {
			setError('Please select a payment receipt image to upload')
			return
		}

		setIsUploading(true)
		setError(null)

		try {
			const reader = new FileReader()
			reader.onloadend = async () => {
				const base64Image = reader.result

				const res = await fetch('/api/check', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						chatId: id,
						name: image.name,
						imageUrl: base64Image,
					}),
				})
				const bonus0 = await fetch(`/api/users`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						chatId: id,
						bonus: 0,
					}),
				})
				if (!res.ok) throw new Error('Failed to upload image')
				if (!bonus0) throw new Error('Failed to user')
				// const responseData = await res.json()

				// Refresh data after successful upload
				const refreshRes = await fetch(`/api/check`)
				const refreshData = await refreshRes.json()
				setData(Array.isArray(refreshData) ? refreshData : [])

				// Reset form
				setImage(null)
				setPreviewUrl(null)

				setSuccessMessage('Your payment receipt has been successfully uploaded')
				setError(null)
			}

			reader.readAsDataURL(image)
		} catch (err) {
			setError('There was a problem uploading your payment receipt')
			setSuccessMessage(null)
			console.error(err)
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<div className='container mx-auto py-8 px-4'>
			<div className='grid gap-8 md:grid-cols-2'>
				{/* Upload Section */}
				<Card>
					<CardHeader>
						<CardTitle>Upload Payment Receipt</CardTitle>
						<CardDescription>
							Upload your payment receipt for transaction ID:{' '}
							<span className='font-medium'>{id}</span>
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						{error && (
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						{successMessage && (
							<Alert variant='default' className=' border-green-200'>
								<div className='h-4 w-4 text-green-500' />
								<AlertTitle>Success</AlertTitle>
								<AlertDescription>{successMessage}</AlertDescription>
							</Alert>
						)}

						<div className='space-y-2'>
							<Label htmlFor='receipt'>Payment Receipt</Label>
							<div
								className='border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer'
								onClick={() => document.getElementById('file-upload')?.click()}
							>
								<Input
									id='file-upload'
									type='file'
									accept='image/*'
									onChange={handleFileChange}
									className='hidden'
								/>

								{previewUrl ? (
									<div className='relative aspect-video mx-auto max-w-xs'>
										<Image
											src={previewUrl || '/placeholder.svg'}
											alt='Payment receipt preview'
											fill
											className='object-contain rounded-md'
										/>
									</div>
								) : (
									<div className='py-8 flex flex-col items-center gap-2'>
										<Upload className='h-10 w-10 text-muted-foreground' />
										<p className='text-sm text-muted-foreground mt-2'>
											Click to select or drag and drop your payment receipt
										</p>
										<p className='text-xs text-muted-foreground'>
											Supports: JPG, PNG, GIF
										</p>
									</div>
								)}

								{image && (
									<p className='text-sm font-medium mt-2'>{image.name}</p>
								)}
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							onClick={handleSubmit}
							disabled={!image || isUploading}
							className='w-full'
						>
							{isUploading ? (
								<>
									<span className='animate-pulse'>Uploading...</span>
								</>
							) : (
								<>
									<Upload className='mr-2 h-4 w-4' />
									Submit Payment Receipt
								</>
							)}
						</Button>
					</CardFooter>
				</Card>

				{/* Payment History Section */}
				<Card>
					<CardHeader>
						<CardTitle>Payment History</CardTitle>
						<CardDescription>
							View your previously uploaded payment receipts
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className='space-y-4'>
								{[1, 2, 3].map(i => (
									<div key={i} className='flex items-center gap-4'>
										<Skeleton className='h-16 w-16 rounded-md' />
										<div className='space-y-2'>
											<Skeleton className='h-4 w-40' />
											<Skeleton className='h-4 w-24' />
										</div>
									</div>
								))}
							</div>
						) : data.length > 0 ? (
							<div className='space-y-4'>
								{data.map(item => (
									<div
										key={item._id}
										className='flex items-center gap-4 border rounded-lg p-3'
									>
										<div className='relative h-16 w-16 flex-shrink-0'>
											<Image
												src={item.imageUrl || '/placeholder.svg'}
												alt={item.name || 'Payment receipt'}
												fill
												className='object-cover rounded-md'
											/>
										</div>
										<div>
											<p className='font-medium'>
												Transaction ID: {item.chatId}
											</p>
											<p className='text-sm text-muted-foreground'>
												{new Date(
													item.createdAt || Date.now()
												).toLocaleString()}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='text-center py-8'>
								<p className='text-muted-foreground'>
									No payment receipts found
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
