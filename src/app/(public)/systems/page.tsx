import Link from "next/link"
import {
  Zap,
  Heart,
  Wind,
  Droplets,
  Apple,
  Shield,
  Gauge,
  Bone,
  Brain,
  Smile,
  Lightbulb,
  RefreshCw,
  AlertTriangle,
  Thermometer,
  Waves,
} from "lucide-react"

/**
 * Systems Index Page
 *
 * Overview of the 15 Biological Systems Framework from bioEDGE Decoder.
 */

const systems = [
  {
    name: "Breath",
    slug: "breath",
    tagline: "Your Body's Bridge",
    description: "Respiratory system, oxygen delivery, breathing patterns",
    icon: Wind,
    available: true,
  },
  {
    name: "Circulation",
    slug: "circulation",
    tagline: "Your Body's Delivery Network",
    description: "Heart, blood vessels, blood flow, cardiovascular health",
    icon: Heart,
    available: true,
  },
  {
    name: "Consciousness",
    slug: "consciousness",
    tagline: "Your Body's Inner Witness",
    description: "Awareness, presence, thought quality, mental clarity",
    icon: Lightbulb,
    available: true,
  },
  {
    name: "Defense",
    slug: "defense",
    tagline: "Your Body's Intelligent Shield",
    description: "Immune function, inflammation, autoimmunity",
    icon: Shield,
    available: true,
  },
  {
    name: "Detoxification",
    slug: "detoxification",
    tagline: "Your Body's Clearing House",
    description: "Liver function, lymphatic drainage, elimination",
    icon: Droplets,
    available: true,
  },
  {
    name: "Digestive",
    slug: "digestive",
    tagline: "Your Body's Transformation Engine",
    description: "Gut health, microbiome, nutrient absorption",
    icon: Apple,
    available: true,
  },
  {
    name: "Emotional",
    slug: "emotional",
    tagline: "Your Body's Meaning Maker",
    description: "Mental wellbeing, mood regulation, psychological health",
    icon: Smile,
    available: true,
  },
  {
    name: "Energy Production",
    slug: "energy-production",
    tagline: "Your Body's Power Grid",
    description: "Mitochondrial function, ATP, metabolic efficiency",
    icon: Zap,
    available: true,
  },
  {
    name: "Hormonal",
    slug: "hormonal",
    tagline: "Your Body's Orchestra",
    description: "Endocrine system, hormone balance, thyroid, adrenals",
    icon: Gauge,
    available: true,
  },
  {
    name: "Hydration",
    slug: "hydration",
    tagline: "Your Body's Internal Ocean",
    description: "Fluid balance, electrolytes, cellular hydration",
    icon: Waves,
    available: true,
  },
  {
    name: "Nervous System",
    slug: "nervous-system",
    tagline: "Your Body's Communication Network",
    description: "Brain-body connection, neural pathways, vagal tone",
    icon: Brain,
    available: true,
  },
  {
    name: "Regeneration",
    slug: "regeneration",
    tagline: "Your Body's Rebuild Crew",
    description: "Cellular repair, stem cells, longevity pathways",
    icon: RefreshCw,
    available: true,
  },
  {
    name: "Stress Response",
    slug: "stress-response",
    tagline: "Your Body's Alert System",
    description: "Fight or flight, cortisol regulation, stress adaptation",
    icon: AlertTriangle,
    available: true,
  },
  {
    name: "Structure & Movement",
    slug: "structure-movement",
    tagline: "Your Body's Living Architecture",
    description: "Bones, joints, connective tissue, muscles, mobility",
    icon: Bone,
    available: true,
  },
  {
    name: "Temperature",
    slug: "temperature",
    tagline: "Your Body's Thermostat",
    description: "Heat regulation, cold tolerance, metabolic temperature",
    icon: Thermometer,
    available: true,
  },
]

export default function SystemsIndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy via-deep-blue to-electric-blue">
        <div className="mx-auto max-w-[1200px] px-8 py-16 md:py-20">
          <div className="flex items-start gap-6">
            <img
              src="https://qfilerjwqhphxheqnozl.supabase.co/storage/v1/object/public/media/general/1771278971437-bi-fade-logo.png"
              alt="BioEdge"
              className="h-[100px] w-[100px] flex-shrink-0 hidden md:block"
            />
            <div>
              <h1 className="mb-4 text-4xl font-bold tracking-wide text-white md:text-5xl">
                15 Biological Systems
              </h1>
              <p className="max-w-2xl text-lg text-white/90">
                A framework for understanding your body&apos;s signals. Each system represents a domain of function that produces observable patterns when supported or stressed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="be-container py-12">
        {/* EDGE Framework */}
        <div className="mb-12">
          <div className="be-card">
            <Link href="/framework" className="font-heading font-bold text-xl mb-4 block hover:text-electric-blue transition-colors" style={{ color: "#0d2840" }}>
              The EDGE Framework
            </Link>
            <p className="body-text mb-6">
              Each system report follows the same structure, guiding you through a process of discovery:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-white font-heading font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#0d2840" }}>E</span>
                <div>
                  <p className="font-heading font-bold" style={{ color: "#0d2840" }}>Eliminate</p>
                  <p className="text-sm text-text-light">Identify and remove interference</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-white font-heading font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#0d2840" }}>D</span>
                <div>
                  <p className="font-heading font-bold" style={{ color: "#0d2840" }}>Decode</p>
                  <p className="text-sm text-text-light">Understand what your body is communicating</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-white font-heading font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#0d2840" }}>G</span>
                <div>
                  <p className="font-heading font-bold" style={{ color: "#0d2840" }}>Gain</p>
                  <p className="text-sm text-text-light">Explore supportive practices and resources</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-white font-heading font-bold text-sm flex-shrink-0" style={{ backgroundColor: "#0d2840" }}>E</span>
                <div>
                  <p className="font-heading font-bold" style={{ color: "#0d2840" }}>Execute</p>
                  <p className="text-sm text-text-light">Take action with patience and consistency</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 15 Biological Systems */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {systems.map((system) => {
            const Icon = system.icon
            const card = (
              <div className="group relative overflow-hidden rounded-2xl border border-deep-blue/10 bg-gradient-to-br from-off-white to-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(13,89,138,0.15)] h-full">
                <div className="absolute left-0 right-0 top-0 h-1 origin-left scale-x-0 bg-navy transition-transform duration-400 group-hover:scale-x-100" />
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: system.available
                        ? "linear-gradient(135deg, #017ab2 0%, #0d2840 100%)"
                        : "#e5e7eb",
                    }}
                  >
                    <Icon className={`h-5 w-5 ${system.available ? "text-white" : "text-gray-400"}`} />
                  </span>
                  <div>
                    <p className="font-heading font-bold text-navy transition-colors group-hover:text-electric-blue">
                      {system.name}
                    </p>
                    <p className="mt-0.5 text-sm text-text-light">{system.description}</p>
                  </div>
                </div>
              </div>
            )

            if (system.available) {
              return (
                <Link key={system.slug} href={`/systems/${system.slug}`}>
                  {card}
                </Link>
              )
            }
            return <div key={system.slug}>{card}</div>
          })}
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "15 Biological Systems | bioEDGE Decoder",
  description: "A framework for understanding your body's signals. Each system represents a domain of function that produces observable patterns when supported or stressed.",
}
