import { NextRequest, NextResponse } from 'next/server'
import { rateLimiter } from '@/lib/rate-limiter'

const getClientIp = (req: NextRequest): string => {
	const forwarded = req.headers.get('x-forwarded-for')
	return forwarded?.split(',')[0]?.trim() || 'unknown'
}

const publicPaths = ['/', '/login'] // ochiq sahifalar ro'yxati

export function middleware(req: NextRequest) {
	const ip = getClientIp(req)
	const token = req.cookies.get('__Secure-next-auth.session-token')?.value
	const { pathname } = req.nextUrl

	// Token yo'q va yopiq sahifaga kirishga urinsa => login sahifasiga redirect
	const isPublic = publicPaths.some(
		path => pathname === path || pathname.startsWith(path + '/')
	)
	if (!token && !isPublic) {
		const loginUrl = req.nextUrl.clone()
		loginUrl.pathname = '/login'
		return NextResponse.redirect(loginUrl)
	}

	// IP asosida rate limitni tekshirish
	if (!rateLimiter(ip)) {
		return NextResponse.json(
			{ message: 'Too many requests, please try again later.' },
			{ status: 429 }
		)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
