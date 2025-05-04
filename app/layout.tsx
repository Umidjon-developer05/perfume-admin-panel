import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/theme-provider'

import './globals.css'

export const metadata: Metadata = {
	title: 'Ifor perfume admin panel',
	description: 'Ifor perfume admin panel',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
