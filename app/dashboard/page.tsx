import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/ui/stats-card'
import { getUserStats } from '@/lib/data/users'
import { getOrderStats } from '@/lib/data/orders'
import { getProductStats } from '@/lib/data/products'
import { getCategoryStats } from '@/lib/data/categories'
import {
	Users,
	ShoppingBag,
	Tag,
	DollarSign,
	Package,
	Bell,
	ArrowRight,
} from 'lucide-react'

export default async function DashboardPage() {
	const userStats = await getUserStats()
	const orderStats = await getOrderStats()
	const productStats = await getProductStats()
	const categoryStats = await getCategoryStats()

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-3xl font-bold'>Dashboard</h1>
				<div className='flex items-center gap-2'>
					{orderStats.unreadOrders > 0 && (
						<Link href='/dashboard/orders'>
							<Button variant='outline' className='gap-2'>
								<Bell className='h-4 w-4' />
								<span>{orderStats.unreadOrders} New Orders</span>
							</Button>
						</Link>
					)}
				</div>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<StatsCard
					title='Total Users'
					value={userStats.totalUsers}
					description={`${userStats.newUsersToday} new today`}
					icon={<Users className='h-4 w-4' />}
				/>
				<StatsCard
					title='Total Orders'
					value={orderStats.totalOrders}
					description={`${orderStats.newOrdersToday} new today`}
					icon={<ShoppingBag className='h-4 w-4' />}
				/>
				<StatsCard
					title='Total Products'
					value={productStats.totalProducts}
					description={`${productStats.inStockProducts} in stock`}
					icon={<Package className='h-4 w-4' />}
				/>
				<StatsCard
					title='Total Revenue'
					value={`${orderStats.totalRevenue.toLocaleString()} so'm`}
					icon={<DollarSign className='h-4 w-4' />}
				/>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<Card className='col-span-1 md:col-span-2 lg:col-span-1'>
					<CardHeader>
						<CardTitle>Order Status</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>Pending</span>
								<span className='font-medium'>{orderStats.pendingOrders}</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>Paid</span>
								<span className='font-medium'>{orderStats.paidOrders}</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>Confirmed</span>
								<span className='font-medium'>
									{orderStats.confirmedOrders}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>Shipped</span>
								<span className='font-medium'>{orderStats.shippedOrders}</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>Delivered</span>
								<span className='font-medium'>
									{orderStats.deliveredOrders}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>Cancelled</span>
								<span className='font-medium'>
									{orderStats.cancelledOrders}
								</span>
							</div>
						</div>
						<div className='mt-4'>
							<Link href='/dashboard/orders'>
								<Button variant='outline' className='w-full gap-2'>
									<span>View All Orders</span>
									<ArrowRight className='h-4 w-4' />
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>User Statistics</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>Total Users</span>
								<span className='font-medium'>{userStats.totalUsers}</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>With Phone Number</span>
								<span className='font-medium'>{userStats.usersWithPhone}</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>With Referrals</span>
								<span className='font-medium'>
									{userStats.usersWithReferrals}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>New Today</span>
								<span className='font-medium'>{userStats.newUsersToday}</span>
							</div>
						</div>
						<div className='mt-4'>
							<Link href='/dashboard/users'>
								<Button variant='outline' className='w-full gap-2'>
									<span>View All Users</span>
									<ArrowRight className='h-4 w-4' />
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Top Categories</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-2'>
							{categoryStats.topCategories.length > 0 ? (
								categoryStats?.topCategories?.map(category => (
									<div
										key={category._id}
										className='flex items-center justify-between'
									>
										<span className='text-sm'>{category.name}</span>
										<span className='font-medium'>
											{category.count} products
										</span>
									</div>
								))
							) : (
								<p className='text-sm text-muted-foreground'>
									No categories found
								</p>
							)}
						</div>
						<div className='mt-4'>
							<Link href='/dashboard/categories'>
								<Button variant='outline' className='w-full gap-2'>
									<span>Manage Categories</span>
									<ArrowRight className='h-4 w-4' />
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='grid gap-4 md:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>Product Statistics</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>Total Products</span>
								<span className='font-medium'>
									{productStats.totalProducts}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>In Stock</span>
								<span className='font-medium'>
									{productStats.inStockProducts}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>Out of Stock</span>
								<span className='font-medium'>
									{productStats.outOfStockProducts}
								</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm'>Featured</span>
								<span className='font-medium'>
									{productStats.featuredProducts}
								</span>
							</div>
						</div>
						<div className='mt-4'>
							<Link href='/dashboard/products'>
								<Button variant='outline' className='w-full gap-2'>
									<span>Manage Products</span>
									<ArrowRight className='h-4 w-4' />
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid gap-2 md:grid-cols-2'>
							<Link href='/dashboard/products/new'>
								<Button
									variant='outline'
									className='w-full justify-start gap-2'
								>
									<Package className='h-4 w-4' />
									<span>Add Product</span>
								</Button>
							</Link>
							<Link href='/dashboard/categories/new'>
								<Button
									variant='outline'
									className='w-full justify-start gap-2'
								>
									<Tag className='h-4 w-4' />
									<span>Add Category</span>
								</Button>
							</Link>
							<Link href='/dashboard/orders'>
								<Button
									variant='outline'
									className='w-full justify-start gap-2'
								>
									<ShoppingBag className='h-4 w-4' />
									<span>View Orders</span>
								</Button>
							</Link>
							<Link href='/dashboard/users'>
								<Button
									variant='outline'
									className='w-full justify-start gap-2'
								>
									<Users className='h-4 w-4' />
									<span>View Users</span>
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
