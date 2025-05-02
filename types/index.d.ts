export interface UserType {
	_id: string
	username?: string
	firstName?: string
	lastName?: string
	telegramId: string
	phoneNumber?: string
	createdAt: Date
	lastActive: Date
	referralCount: number
	referralBonus: number
	referredBy: string[]
	referralPurchases: {
		orderId: string
		date: Date
		bonus: number
	}[]
	__v?: number
}
export interface ReturnActionType {
	user: IUser
	failure: string
	checkoutUrl: string
	status: number
	isNext: boolean
	products: IProduct[]
	product: IProduct
	customers: IUser[]
	orders: IOrder[]
	transactions: ITransaction[]
	statistics: {
		totalOrders: number
		totalTransactions: number
		totalFavourites: number
	}
}
export interface AdminUser {
	_id: string
	name: string
	email: string
	role: string
	createdAt: string
	updatedAt: string
}
