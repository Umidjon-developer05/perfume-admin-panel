import { type NextRequest, NextResponse } from 'next/server'
import { getUsers } from '@/lib/data/users'
import Users from '@/lib/models/user.model'
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const page = Number(searchParams.get('page')) || 1
		const limit = Number(searchParams.get('limit')) || 10
		const search = searchParams.get('search') || ''

		const result = await getUsers(page, limit, search)

		return NextResponse.json(result)
	} catch (error) {
		console.error('Error fetching users:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch users' },
			{ status: 500 }
		)
	}
}

export async function PUT(request: NextRequest) {
	const { chatId, bonus } = await request.json()
	console.log(chatId, bonus)
	if (!chatId) {
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
	}
	const user = await Users.findOneAndUpdate(
		{
			telegramId: chatId,
		},
		{ $set: { referralBonus: 0 } },
		{ new: true }
	)

	return NextResponse.json(user)
}
