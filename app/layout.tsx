import type React from "react"
import "./globals.css"
import "../styles/rich-text.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
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
          
          {/* Inklusion Accessibility Tracking Pixel */}
          <Script
            id="inklusion-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                    var i7e_e = document.createElement("script"),
                        i7e_t = window.location.host,
                        i7e_n = "es-US";
                  
                    i7e_e.type = "text/javascript", 
                    i7e_t = "canaldelcongreso.inklusion.incluirt.com",
                    i7e_n = "es-US",
                    i7e_e.src = ("https:" == document.location.protocol ? "https://" : "http://") + i7e_t + "/inklusion/js/frameworks_initializer.js?lng=" + i7e_n, 
                    document.getElementsByTagName("head")[0].appendChild(i7e_e), 
                    i7e_e.src;
                    i7e_tab = true;
                    i7e_border = "#000000"; //color de borde
                    i7e_bg = "#483285"; //color de fondo del texto de Inklusion 
                    setTimeout(function(){
                        var i7e_style = document.createElement("style");
                        i7e_style.type = "text/css";
                        i7e_style.id = "inklu_style_script";
                        i7e_style.append("#_inklusion__tab_ { z-index: 99999 !important } ");
                        document.body.appendChild(i7e_style);
                    },1500);
                })()
              `,
            }}
          />
        </body>
    </html>
  )
}