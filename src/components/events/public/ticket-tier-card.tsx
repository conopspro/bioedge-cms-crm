"use client"

import { useEffect, useRef } from "react"
import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TicketFeature {
  id: string
  name?: string
  feature_text?: string
  description?: string | null
  dollar_value?: number | null
  is_included: boolean
}

interface TicketTierCardProps {
  name: string
  description?: string | null
  price: number
  originalPrice?: number | null
  currency?: string
  features: TicketFeature[]
  registrationUrl: string
  isSoldOut?: boolean
  waitlistUrl?: string | null
  isHighlighted?: boolean
  highlightText?: string | null
  className?: string
  // Color customization
  cardBg?: string | null
  titleColor?: string | null
  textColor?: string | null
  buttonBg?: string | null
  buttonText?: string | null
  accentColor?: string | null
  // Animation
  animateOnScroll?: boolean
  animationDelay?: number
}

export function TicketTierCard({
  name,
  description,
  price,
  originalPrice,
  currency = "USD",
  features,
  registrationUrl,
  isSoldOut = false,
  waitlistUrl,
  isHighlighted = false,
  highlightText,
  className = "",
  cardBg,
  titleColor,
  textColor,
  buttonBg,
  buttonText,
  accentColor,
  animateOnScroll = false,
  animationDelay = 0,
}: TicketTierCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animateOnScroll || !cardRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add delay for staggered animation
            setTimeout(() => {
              entry.target.classList.add("opacity-100", "translate-y-0")
              entry.target.classList.remove("opacity-0", "translate-y-8")
            }, animationDelay)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    observer.observe(cardRef.current)

    return () => observer.disconnect()
  }, [animateOnScroll, animationDelay])
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalValue = features
    .filter((f) => f.is_included !== false && f.dollar_value)
    .reduce((sum, f) => sum + (f.dollar_value || 0), 0)

  // Default colors
  const cardBackground = cardBg || undefined
  const title = titleColor || undefined
  const text = textColor || undefined
  const btnBg = buttonBg || '#0a2540'
  const btnText = buttonText || '#ffffff'
  const accent = accentColor || '#22c55e' // green for checkmarks

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all duration-500 ease-out hover:shadow-[0_20px_40px_rgba(13,89,138,0.15)] hover:-translate-y-2 overflow-hidden",
        isHighlighted && "ring-2 ring-gold/20 scale-105",
        animateOnScroll && "opacity-0 translate-y-8",
        className
      )}
      style={{
        backgroundColor: cardBackground,
        borderColor: isHighlighted ? (accentColor || '#c9a227') : undefined
      }}
    >
      {/* Top border animation on hover */}
      <div
        className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ backgroundColor: accentColor || '#c9a227' }}
      />
      {/* Highlighted badge */}
      {isHighlighted && highlightText && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold"
            style={{ backgroundColor: accent, color: btnText }}
          >
            <Star className="h-3.5 w-3.5 fill-current" />
            {highlightText}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2" style={{ color: title }}>{name}</h3>
        {description && (
          <p className="text-lg" style={{ color: text }}>{description}</p>
        )}
      </div>

      {/* Pricing */}
      <div className="text-center mb-6">
        {/* Current price - large and prominent */}
        <div className="text-4xl font-bold" style={{ color: title }}>
          {formatPrice(price)}
        </div>

        {originalPrice && originalPrice > price && (
          <>
            {/* Original price - struck through */}
            <div className="mt-1">
              <span className="line-through text-lg" style={{ color: text, opacity: 0.6 }}>
                {formatPrice(originalPrice)}
              </span>
            </div>
            {/* Savings */}
            <div className="mt-1 font-semibold" style={{ color: '#f83b89', fontSize: '1rem' }}>
              Save {formatPrice(originalPrice - price)}
            </div>
          </>
        )}

        {totalValue > 0 && totalValue > price && (
          <p className="text-lg mt-2" style={{ color: text }}>
            {formatPrice(totalValue)} total value
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-grow">
        {features
          .filter((f) => f.is_included !== false)
          .map((feature) => (
            <li key={feature.id} className="flex items-start gap-3">
              <Check className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: accent }} />
              <div>
                <span className="text-lg" style={{ color: text }}>{feature.feature_text || feature.name}</span>
                {feature.dollar_value && (
                  <span className="text-sm ml-2" style={{ color: text, opacity: 0.7 }}>
                    ({formatPrice(feature.dollar_value)} value)
                  </span>
                )}
              </div>
            </li>
          ))}
      </ul>

      {/* Spacer to push content up evenly across cards */}
      <div className="flex-grow" />
    </div>
  )
}
