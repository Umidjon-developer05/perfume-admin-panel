import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from '@/lib/db'
import Admin from '@/lib/models/admin.model'
import bcrypt from 'bcryptjs'
import { SessionStrategy } from 'next-auth'
export const authOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				await connectToDatabase()
				const admin = await Admin.findOne({ email: credentials?.email })
				if (!admin) return null

				const isValid = await bcrypt.compare(
					credentials!.password,
					admin.password
				)

				if (!isValid) return null

				// Return the user object (required)
				return {
					id: admin._id.toString(),
					email: admin.email,
					name: admin.name,
					role: admin.role,
				}
			},
		}),
	],
	session: {
		strategy: 'jwt' as SessionStrategy,
	},
	pages: {
		signIn: '/login', // your login route
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async jwt({ token, user }: { token: any; user: any }) {
			if (user) {
				token.id = user.id
				token.role = user.role
			}
			return token
		},
		async session({ session, token }: { session: any; token: any }) {
			if (token) {
				session.user.id = token.id
				session.user.role = token.role
			}
			return session
		},
	},
}
