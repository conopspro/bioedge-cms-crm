"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import {
  Zap, Heart, Wind, Droplets, Apple, Shield, Gauge,
  Bone, Brain, Smile, Lightbulb, RefreshCw, AlertTriangle,
  Thermometer, Waves, Star, ScanLine,
} from "lucide-react"

const biologicalSystems = [
  { name: "Breath", slug: "breath", description: "Respiratory system, oxygen delivery, breathing patterns", icon: Wind },
  { name: "Circulation", slug: "circulation", description: "Heart, blood vessels, blood flow, cardiovascular health", icon: Heart },
  { name: "Consciousness", slug: "consciousness", description: "Awareness, presence, thought quality, mental clarity", icon: Lightbulb },
  { name: "Defense", slug: "defense", description: "Immune function, inflammation, autoimmunity", icon: Shield },
  { name: "Detoxification", slug: "detoxification", description: "Liver function, lymphatic drainage, elimination", icon: Droplets },
  { name: "Digestive", slug: "digestive", description: "Gut health, microbiome, nutrient absorption", icon: Apple },
  { name: "Emotional", slug: "emotional", description: "Mental wellbeing, mood regulation, psychological health", icon: Smile },
  { name: "Energy Production", slug: "energy-production", description: "Mitochondrial function, ATP, metabolic efficiency", icon: Zap },
  { name: "Hormonal", slug: "hormonal", description: "Endocrine system, hormone balance, thyroid, adrenals", icon: Gauge },
  { name: "Hydration", slug: "hydration", description: "Fluid balance, electrolytes, cellular hydration", icon: Waves },
  { name: "Nervous System", slug: "nervous-system", description: "Brain-body connection, neural pathways, vagal tone", icon: Brain },
  { name: "Regeneration", slug: "regeneration", description: "Cellular repair, stem cells, longevity pathways", icon: RefreshCw },
  { name: "Stress Response", slug: "stress-response", description: "Fight or flight, cortisol regulation, stress adaptation", icon: AlertTriangle },
  { name: "Structure & Movement", slug: "structure-movement", description: "Bones, joints, connective tissue, muscles, mobility", icon: Bone },
  { name: "Temperature", slug: "temperature", description: "Heat regulation, cold tolerance, metabolic temperature", icon: Thermometer },
]

const edgeItems = [
  {
    letter: "E",
    title: "ELIMINATE",
    description:
      "Before you add anything, remove what's interfering. Chemical, digital, and behavioral noise all distort signals.",
  },
  {
    letter: "D",
    title: "DECODE",
    description:
      "Your body speaks in signals, not symptoms. Learn to notice what your systems are communicating.",
  },
  {
    letter: "G",
    title: "GAIN",
    description:
      "Optimization works after interference is eliminated and signals are decoded. The order matters.",
  },
  {
    letter: "E",
    title: "EXECUTE",
    description:
      "You're in it for the long term. Be patient and consistent, long enough for the body to respond.",
  },
]

interface EdgeFrameworkProps {
  label?: string | null
  title?: string | null
  description?: string | null
  settings?: Record<string, any> | null
}

export function EdgeFramework({ label, title, description, settings }: EdgeFrameworkProps) {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  const bgColor = settings?.bg_color || "#ffffff"
  const titleColor = settings?.title_color || undefined
  const labelBgColor = settings?.label_bg_color || undefined
  const textColor = settings?.text_color || undefined

  const displayLabel = label ?? "THE EDGE FRAMEWORK"
  const displayTitle = title ?? "ORDER MATTERS"
  const displayDescription = description ?? "You cannot supplement your way out of bad habits."

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0")
            entry.target.classList.remove("opacity-0", "translate-y-5")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="edge" className="px-8 py-12" style={{ backgroundColor: bgColor }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 text-center">
          {displayLabel && (
            <span
              className="mb-4 inline-block rounded px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white"
              style={{ backgroundColor: labelBgColor || undefined }}
            >
              {displayLabel}
            </span>
          )}
          <h2
            className="mb-4 text-[30px] font-bold tracking-wide"
            style={{ color: titleColor || undefined }}
          >
            <Link href="/framework" className="hover:text-electric-blue transition-colors">
              {displayTitle}
            </Link>
          </h2>
          <p
            className="mx-auto max-w-[700px] text-xl"
            style={{ color: textColor || undefined }}
          >
            {displayDescription}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {edgeItems.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              className="group relative overflow-hidden rounded-2xl border border-deep-blue/10 bg-gradient-to-br from-off-white to-white p-8 text-center opacity-0 translate-y-5 transition-all duration-600 ease-out hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(13,89,138,0.15)]"
            >
              {/* Top border animation */}
              <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-navy transition-transform duration-400 group-hover:scale-x-100" />

              <div className="mb-2 text-5xl font-bold leading-none text-electric-blue">{item.letter}</div>
              <h3 className="mb-4 text-xl font-bold text-navy">{item.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-deep-blue">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Book Promo */}
        <div className="mt-12 mb-12">
          <a
            href="https://www.amazon.com/Biological-EDGE-Practical-Guide-Longevity-ebook/dp/B0GJQ5NDGF/ref=sr_1_1"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-2xl border border-deep-blue/10 bg-gradient-to-br from-navy to-deep-blue transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(13,89,138,0.25)]"
          >
            <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-electric-blue transition-transform duration-400 group-hover:scale-x-100" />
            <div className="flex items-center gap-6 px-6 py-4 md:gap-8 md:px-8">
              <img
                src="https://qfilerjwqhphxheqnozl.supabase.co/storage/v1/object/public/media/general/1771290785045-bioedge-book.png"
                alt="Biological EDGE: A Practical Guide to Longevity"
                className="h-32 w-auto flex-shrink-0 rounded shadow-xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white md:text-2xl">
                  Biological EDGE:<span className="font-normal text-white"> A Practical Guide to Longevity</span>
                </h3>
                <div className="mt-3 hidden sm:block">
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm italic text-white/80">
                    &ldquo;Meticulous research. Penetrating analysis. Data-driven conclusions. A solid framework for change.&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    &mdash; Dr. Michael J. Krentz
                  </p>
                </div>
              </div>
              <span className="hidden flex-shrink-0 items-center gap-2 rounded-full bg-electric-blue px-5 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-white group-hover:text-navy sm:inline-flex">
                Available on Amazon
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </a>
        </div>

        {/* 15 Biological Systems */}
        <div>
          <h3 className="mb-6 text-center text-[30px] font-bold tracking-wide" style={{ color: titleColor || undefined }}>
            <Link href="/systems" className="hover:text-electric-blue transition-colors">
              15 Biological Systems
            </Link>
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {biologicalSystems.map((system) => {
              const Icon = system.icon
              return (
                <Link key={system.slug} href={`/systems/${system.slug}`}>
                  <div className="group relative overflow-hidden rounded-2xl border border-deep-blue/10 bg-gradient-to-br from-off-white to-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(13,89,138,0.15)]">
                    <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-navy transition-transform duration-400 group-hover:scale-x-100" />
                    <div className="flex items-start gap-4">
                      <span
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ background: "linear-gradient(135deg, #017ab2 0%, #0d2840 100%)" }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                      <div>
                        <p className="font-bold text-navy transition-colors group-hover:text-electric-blue">
                          {system.name}
                        </p>
                        <p className="mt-0.5 text-sm text-deep-blue">{system.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* bioEDGE Decoder Promo */}
        <div className="mt-12">
          <a
            href="https://bioedgedecoder.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-2xl border border-deep-blue/10 bg-gradient-to-br from-navy to-deep-blue transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(13,89,138,0.25)]"
          >
            <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-electric-blue transition-transform duration-400 group-hover:scale-x-100" />
            <div className="flex items-center gap-6 px-6 py-4 md:gap-8 md:px-8">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 shadow-xl transition-transform duration-300 group-hover:scale-105">
                <ScanLine className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white md:text-2xl">
                  bioEDGE Decoder
                </h3>
                <div className="mt-3 hidden sm:block">
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm italic text-white/80">
                    &ldquo;When Something Feels Off, This Helps You Understand Why&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    A simple way to interpret your signals so you can make clearer health decisions.
                  </p>
                </div>
              </div>
              <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-electric-blue px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-white group-hover:text-navy sm:gap-2 sm:px-5 sm:py-2 sm:text-sm">
                Get Clarity
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </a>
        </div>

      </div>
    </section>
  )
}
