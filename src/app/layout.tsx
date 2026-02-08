import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bioedgelongevity.com"),
  title: {
    default: "bioEDGE Longevity | Science-Backed Longevity & Health Optimization",
    template: "%s | bioEDGE Longevity",
  },
  description: "Discover evidence-based longevity science, health optimization strategies, and cutting-edge solutions from industry-leading experts and companies.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "bioEDGE Longevity",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
}

/**
 * Root Layout
 *
 * This is the top-level layout for the entire application.
 * It sets up fonts, metadata, and the HTML structure.
 *
 * Uses IBM Plex Mono for headings and Source Sans 3 for body text.
 * Fonts are loaded via CSS @import in globals.css.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K8TCH05R07"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K8TCH05R07');
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
