import type { Metadata, Viewport } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Reveald | Read between the lines',
  description: 'Paste any conversation and discover what people really mean in their messages.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Reveald',
  },
  openGraph: {
    title: 'Reveald | Read between the lines',
    description: 'Paste any conversation and discover what people really mean in their messages.',
    type: 'website',
    siteName: 'Reveald',
  },
  twitter: {
    card: 'summary',
    title: 'Reveald | Read between the lines',
    description: 'Paste any conversation and discover what people really mean in their messages.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FFFFFF',
}

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID

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
        {FB_PIXEL_ID && (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${FB_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </body>
    </html>
  )
}
