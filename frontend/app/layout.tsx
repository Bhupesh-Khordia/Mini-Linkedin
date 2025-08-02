import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProfessionalHub - Connect with Professionals',
  description: 'A modern professional networking platform where professionals connect, share insights, and grow their careers.',
  keywords: 'professional networking, career, business, connections, professional community',
  authors: [{ name: 'ProfessionalHub Team' }],
  creator: 'ProfessionalHub',
  publisher: 'ProfessionalHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://professionalhub.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ProfessionalHub - Connect with Professionals',
    description: 'A modern professional networking platform where professionals connect, share insights, and grow their careers.',
    url: 'https://professionalhub.com',
    siteName: 'ProfessionalHub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ProfessionalHub - Professional Networking Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProfessionalHub - Connect with Professionals',
    description: 'A modern professional networking platform where professionals connect, share insights, and grow their careers.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
} 