import type React from "react"
import "./globals.css"
import "../styles/rich-text.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import SocialBar from "@/components/social-bar"
import AccessibilityButton from "@/components/accessibility-button"
import Navbar from "@/components/navbar"
import { MobileMenuProvider } from "@/components/mobile-menu-context"
import ConditionalComponents from "@/components/conditional-components"
import { FloatingPlayerProvider } from "@/components/floating-player-context"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import AutoPublishScheduler from "@/components/auto-publish-scheduler"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Canal del Congreso",
  description: "Canal oficial del Congreso de México",
  icons: {
    icon: [
      {
        url: '/favicon.png',
        type: 'image/png',
      }
    ]
  },
    generator: 'v0.dev',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  other: {
    'msvalidate.01': 'your-bing-webmaster-verification-code',
    'google-site-verification': 'your-google-search-console-verification-code'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        {/* Analytics - Only in production and client-side */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                  // Disable console in production
                  console.log = console.warn = console.error = function() {};
                }
              `,
            }}
          />
        )}
        <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
      </head>
      <body className={inter.className} suppressHydrationWarning>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="light" 
            enableSystem={false}
            disableTransitionOnChange
          >
            <MobileMenuProvider>
              <FloatingPlayerProvider>
                <AutoPublishScheduler />
                <ConditionalComponents />
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
                <Toaster />
              </FloatingPlayerProvider>
            </MobileMenuProvider>
          </ThemeProvider>
        </body>
    </html>
  )
}