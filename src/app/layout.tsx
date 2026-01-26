import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BioEdge CMS",
  description: "Content Management System and CRM for BioEdge Magazine",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
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
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
