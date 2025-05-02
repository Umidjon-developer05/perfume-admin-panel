import { connectToDatabase } from '@/lib/db'
import UserModel from '@/lib/models/user.model'
import { UserType } from '@/types'

export async function getUsers(page = 1, limit = 10, search = '') {
	try {
		await connectToDatabase()

		const query = search
			? {
					$or: [
						{ telegramId: { $regex: search, $options: 'i' } },
						{ username: { $regex: search, $options: 'i' } },
						{ firstName: { $regex: search, $options: 'i' } },
						{ lastName: { $regex: search, $options: 'i' } },
						{ phoneNumber: { $regex: search, $options: 'i' } },
					],
			  }
			: {}

		const skip = (page - 1) * limit

		const users = await UserModel.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean()

		const total = await UserModel.countDocuments(query)

		return {
			users,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		}
	} catch (error) {
		console.error('Failed to fetch users:', error)
		throw new Error('Failed to fetch users')
	}
}

export async function getUserById(id: string): Promise<UserType | null> {
	try {
		await connectToDatabase()
		const user = (await UserModel.findOne({
			telegramId: id,
		}).lean()) as UserType | null
		if (!user) return null
		return {
			_id: user._id.toString(),
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			telegramId: user.telegramId,
			phoneNumber: user.phoneNumber,
			createdAt: user.createdAt,
			lastActive: user.lastActive,
			referralCount: user.referralCount,
			referralBonus: user.referralBonus,
			referredBy: user.referredBy || [],
			referralPurchases: user.referralPurchases || [],
			__v: user.__v,
		}
	} catch (error) {
		console.error('Failed to fetch user:', error)
		throw new Error('Failed to fetch user')
	}
}

export async function getUserStats() {
	try {
		await connectToDatabase()

		const totalUsers = await UserModel.countDocuments()
		const usersWithReferrals = await UserModel.countDocuments({
			referralCount: { $gt: 0 },
		})
		const usersWithPhone = await UserModel.countDocuments({
			phoneNumber: { $exists: true, $ne: '' },
		})

		const newUsersToday = await UserModel.countDocuments({
			createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
		})

		return {
			totalUsers,
			usersWithReferrals,
			usersWithPhone,
			newUsersToday,
		}
	} catch (error) {
		console.error('Failed to fetch user stats:', error)
		throw new Error('Failed to fetch user stats')
	}
}
