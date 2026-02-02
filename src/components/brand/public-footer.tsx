import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  href: string
  is_external: boolean
  display_order: number
}

interface PublicFooterProps {
  className?: string
  navItems?: NavItem[]
}

/**
 * Public Footer
 *
 * Footer component for public-facing pages with BioEdge branding.
 * Uses solid Deep Blue (#0d598a) background.
 * Navigation is database-driven when navItems are provided.
 */
export function PublicFooter({ className, navItems }: PublicFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn("bg-[#0d598a] text-white", className)}>
      <div className="be-container py-12">
        {/* Disclaimer - at top for visibility */}
        <p className="text-center text-white max-w-3xl mx-auto mb-8">
          This content is for educational purposes only and is not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before making health decisions.
        </p>

        <div className="border-t border-white/20 pt-8">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="inline-block mb-4">
                <div className="font-heading font-bold leading-tight tracking-wide">
                  <span className="text-[20px] md:text-[24px] text-white">BIO</span>
                  <span className="text-[32px] md:text-[40px] text-gold">EDGE</span>
                  <span className="block -mt-1 text-[16px] md:text-[18px] text-white">
                    LONGEVITY SUMMIT
                  </span>
                </div>
              </Link>
              <p className="text-white max-w-md">
                BioEdge covers the latest in biohacking, health optimization, and longevity science.
              </p>
            </div>

            {/* Links */}
            <div className="md:col-span-2">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold mb-4">
                Explore
              </h3>
              <ul className="space-y-1">
                {navItems && navItems.length > 0 ? (
                  navItems.map((item) => (
                    <li key={item.id}>
                      {item.is_external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-gold transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link href={item.href} className="text-white hover:text-gold transition-colors">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <Link href="/articles" className="text-white hover:text-gold transition-colors">Articles</Link>
                    </li>
                    <li>
                      <Link href="/presentations" className="text-white hover:text-gold transition-colors">Presentations</Link>
                    </li>
                    <li>
                      <Link href="/companies" className="text-white hover:text-gold transition-colors">Companies</Link>
                    </li>
                    <li>
                      <Link href="/leaders" className="text-white hover:text-gold transition-colors">Leaders</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-center text-sm text-white">
              &copy; {currentYear} BioEdge Longevity Summit. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
