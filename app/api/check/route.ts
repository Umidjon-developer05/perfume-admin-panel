import Check from '@/lib/models/check'
import { NextResponse } from 'next/server'
import FormData from 'form-data'
import fetch from 'node-fetch'
import { Buffer } from 'buffer'
export async function POST(req: Request) {
	const { chatId, name, imageUrl } = await req.json()

	const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
	const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '')

	const form = new FormData()
	form.append('chat_id', chatId)
	form.append('caption', `ID: ${chatId} bo'yicha bonus puli to'lab berildi ✅`)
	form.append('photo', Buffer.from(base64Data, 'base64'), {
		filename: name || 'image.jpg',
		contentType: 'image/jpeg',
	})

	const res = await fetch(
		`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`,
		{
			method: 'POST',
			body: form,
		}
	)

	if (!res.ok) {
		const errorText = await res.text()
		return new NextResponse(`Telegram API error: ${errorText}`, { status: 500 })
	}

	const check = await Check.create({ chatId, name, imageUrl })
	return NextResponse.json(check)
}

export async function GET() {
	const checks = await Check.find()
	return NextResponse.json(checks)
}
