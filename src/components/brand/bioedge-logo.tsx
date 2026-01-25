import { cn } from "@/lib/utils"

interface BioEdgeLogoProps {
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Show the decoder subtitle */
  showDecoder?: boolean
  /** Additional CSS classes */
  className?: string
  /** Light mode (for dark backgrounds) or dark mode (for light backgrounds) */
  variant?: "light" | "dark"
}

/**
 * BioEdge Decoder Logo
 *
 * Brand typography component for the BioEdge Decoder logo.
 * Displays "BIO EDGE" with "DECODER" below in brand colors.
 *
 * - BIO: Small white text
 * - EDGE: Large gold text (dominant)
 * - DECODER: Small white text below
 *
 * @example
 * // On dark background (hero sections)
 * <BioEdgeLogo variant="light" size="lg" showDecoder />
 *
 * // On light background
 * <BioEdgeLogo variant="dark" size="md" />
 */
export function BioEdgeLogo({
  size = "md",
  showDecoder = true,
  className,
  variant = "light",
}: BioEdgeLogoProps) {
  const sizeClasses = {
    sm: {
      bio: "text-[18px] md:text-[20px] lg:text-[24px]",
      edge: "text-[32px] md:text-[40px] lg:text-[48px]",
      decoder: "text-[18px] md:text-[20px] lg:text-[24px]",
    },
    md: {
      bio: "text-[28px] md:text-[32px] lg:text-[40px]",
      edge: "text-[48px] md:text-[60px] lg:text-[72px]",
      decoder: "text-[28px] md:text-[32px] lg:text-[40px]",
    },
    lg: {
      bio: "text-[32px] md:text-[40px] lg:text-[48px]",
      edge: "text-[56px] md:text-[72px] lg:text-[96px]",
      decoder: "text-[32px] md:text-[40px] lg:text-[48px]",
    },
  }

  const textColor = variant === "light" ? "text-white" : "text-navy"

  return (
    <h1
      className={cn(
        "font-heading font-bold tracking-wide leading-tight",
        className
      )}
    >
      <span className={cn(sizeClasses[size].bio, textColor)}>BIO</span>
      <span className={cn(sizeClasses[size].edge, "text-gold")}>EDGE</span>
      {showDecoder && (
        <>
          <br />
          <span className={cn("block", sizeClasses[size].decoder, textColor)}>
            DECODER
          </span>
        </>
      )}
    </h1>
  )
}

/**
 * BioEdge Logo Text (inline version)
 *
 * For use in navigation, smaller contexts where you need
 * "BIOEDGE" on a single line.
 */
export function BioEdgeLogoInline({
  size = "sm",
  className,
  variant = "light",
}: Omit<BioEdgeLogoProps, "showDecoder">) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const textColor = variant === "light" ? "text-white" : "text-navy"

  return (
    <span
      className={cn(
        "font-heading font-bold tracking-wide uppercase",
        sizeClasses[size],
        className
      )}
    >
      <span className={textColor}>BIO</span>
      <span className="text-gold">EDGE</span>
    </span>
  )
}

export default BioEdgeLogo
