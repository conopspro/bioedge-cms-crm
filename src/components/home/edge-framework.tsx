"use client"

import { useEffect, useRef } from "react"

const edgeItems = [
  {
    letter: "E",
    title: "ELIMINATE",
    description:
      "Before you add anything, identify what's getting in the way. Chemical, digital, behavioral interference. This is where everything starts.",
  },
  {
    letter: "D",
    title: "DECODE",
    description:
      "Your body sends signals, not symptoms. Learn to interpret what your fifteen systems are communicating before your brain mislabels them.",
  },
  {
    letter: "G",
    title: "GAIN",
    description:
      "Once interference is eliminated and signals are decoded, you can start optimizing with supplements, devices, and practices.",
  },
  {
    letter: "E",
    title: "EXECUTE",
    description:
      "The best protocol requires implementation. Disciplined practice, tracked over time, sustained long enough for your body to respond.",
  },
]

export function EdgeFramework() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

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
    <section id="edge" className="bg-white px-8 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 text-center">
          <span className="mb-4 inline-block rounded bg-deep-blue px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
            THE EDGE FRAMEWORK
          </span>
          <h2 className="mb-4 text-[30px] font-bold tracking-wide text-navy">ORDER MATTERS</h2>
          <p className="mx-auto max-w-[700px] text-xl text-deep-blue">
            You cannot supplement your way out of bad habits.
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
