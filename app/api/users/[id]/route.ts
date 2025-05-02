import { NextResponse } from 'next/server'
import { getUserById } from '@/lib/data/users'
type RouteContext = {
	params: {
		id: string
	}
}
export async function GET(request: Request, { params }: RouteContext) {
	try {
		const user = await getUserById(params?.id)

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		return NextResponse.json(user)
	} catch (error) {
		console.error('Error fetching user:', error)
		return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
	}
}
