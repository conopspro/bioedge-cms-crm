"use client"

import { useEffect, useRef } from "react"

const edgeItems = [
  {
    letter: "E",
    title: "ELIMINATE",
    description:
      "Before you add anything, remove what's interfering. Chemical, digital, and behavioral noise all distort signals. This is where change actually begins.",
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
      "Only after interference is removed and signals are clear does optimization make sense. Supplements, devices, and practices work best when they're added at the right time.",
  },
  {
    letter: "E",
    title: "EXECUTE",
    description:
      "The best protocol only works if you live it. Execution means consistency, feedback, and patience—long enough for the body to respond.",
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
            {displayTitle}
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
              className="group relative overflow-hidden rounded-2xl border border-deep-blue/10 bg-gradient-to-br from-off-white to-white p-8 text-center opacity-0 translate-y-5 transition-all duration-600 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(13,89,138,0.15)]"
            >
              {/* Top border animation */}
              <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-navy transition-transform duration-400 group-hover:scale-x-100" />

              <div className="mb-2 text-5xl font-bold leading-none text-electric-blue">{item.letter}</div>
              <h3 className="mb-4 text-xl font-bold text-navy">{item.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-deep-blue">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
