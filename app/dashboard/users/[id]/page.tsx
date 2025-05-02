import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getUserById } from '@/lib/data/users'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import {
	ArrowLeft,
	User,
	Phone,
	Calendar,
	Users,
	DollarSign,
} from 'lucide-react'
import { UserType } from '@/types'

interface UserDetailPageProps {
	params: {
		id: string
	}
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
	const user: UserType | null = await getUserById(params.id)

	if (!user) {
		notFound()
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Link href='/dashboard/users'>
						<Button variant='ghost' size='icon'>
							<ArrowLeft className='h-4 w-4' />
							<span className='sr-only'>Back</span>
						</Button>
					</Link>
					<h1 className='text-3xl font-bold'>User Details</h1>
				</div>
			</div>

			<div className='grid gap-6 md:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>User Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='flex items-center gap-4'>
								<div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground'>
									<User className='h-6 w-6' />
								</div>
								<div>
									<h2 className='text-xl font-semibold'>
										{user.firstName || user.username || 'Unknown User'}
										{user.lastName && ` ${user.lastName}`}
									</h2>
									<p className='text-sm text-muted-foreground'>
										Telegram ID: {user.telegramId}
									</p>
								</div>
							</div>

							<div className='grid gap-4 pt-4'>
								<div className='flex items-start gap-2'>
									<Phone className='h-5 w-5 text-muted-foreground' />
									<div>
										<p className='font-medium'>Phone Number</p>
										<p className='text-sm text-muted-foreground'>
											{user.phoneNumber || 'Not provided'}
										</p>
									</div>
								</div>

								<div className='flex items-start gap-2'>
									<Calendar className='h-5 w-5 text-muted-foreground' />
									<div>
										<p className='font-medium'>Joined</p>
										<p className='text-sm text-muted-foreground'>
											{formatDate(user.createdAt)}
										</p>
									</div>
								</div>

								<div className='flex items-start gap-2'>
									<Calendar className='h-5 w-5 text-muted-foreground' />
									<div>
										<p className='font-medium'>Last Active</p>
										<p className='text-sm text-muted-foreground'>
											{formatDate(user.lastActive)}
										</p>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Referral Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='flex items-center gap-4'>
								<div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground'>
									<Users className='h-6 w-6' />
								</div>
								<div>
									<h2 className='text-xl font-semibold'>
										{user.referralCount} Referrals
									</h2>
									<p className='text-sm text-muted-foreground'>
										{user.referralBonus > 0
											? `${user.referralBonus.toLocaleString()} so'm bonus earned`
											: 'No bonus earned yet'}
									</p>
								</div>
							</div>

							{user.referredBy && user.referredBy.length > 0 && (
								<div className='pt-4'>
									<p className='font-medium'>Referred By</p>
									<div className='mt-2 space-y-2'>
										{user.referredBy.map((referrerId: string) => (
											<Link
												key={referrerId}
												href={`/dashboard/users/${referrerId}`}
											>
												<Badge variant='outline' className='cursor-pointer'>
													{referrerId}
												</Badge>
											</Link>
										))}
									</div>
								</div>
							)}

							{user.referralPurchases && user.referralPurchases.length > 0 && (
								<div className='pt-4'>
									<p className='font-medium'>Referral Purchases</p>
									<div className='mt-2 space-y-2'>
										{user.referralPurchases.map((purchase, index) => (
											<div
												key={index}
												className='flex items-center justify-between rounded-md border p-2'
											>
												<div>
													<p className='text-sm font-medium'>
														Order #{purchase.orderId}
													</p>
													<p className='text-xs text-muted-foreground'>
														{formatDate(purchase.date)}
													</p>
												</div>
												<div className='flex items-center gap-1 text-green-600'>
													<DollarSign className='h-4 w-4' />
													<span>
														{purchase.bonus.toLocaleString()} so&apos;m
													</span>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
