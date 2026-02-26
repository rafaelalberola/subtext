import type { Metadata, Viewport } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Subtext — Read between the lines',
  description: 'Paste any conversation and discover what people really mean in their messages.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Subtext',
  },
  openGraph: {
    title: 'Subtext — Read between the lines',
    description: 'Paste any conversation and discover what people really mean in their messages.',
    type: 'website',
    siteName: 'Subtext',
  },
  twitter: {
    card: 'summary',
    title: 'Subtext — Read between the lines',
    description: 'Paste any conversation and discover what people really mean in their messages.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FFFFFF',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inter.variable} ${newsreader.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
