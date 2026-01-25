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
      <div className="be-event-hero">
        <div className="be-container py-16 relative z-10">
          <p className="text-sm text-gold font-heading uppercase tracking-wider mb-4">
            bioEDGE Decoder
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            15 Biological Systems
          </h1>
          <p className="text-xl text-white/80">
            A framework for understanding your body&apos;s signals. Each system represents a domain of function that produces observable patterns when supported or stressed.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="be-container py-12">
        {/* EDGE Framework */}
        <div className="mb-12">
          <div className="be-card">
            <h2 className="font-heading font-bold text-xl mb-4" style={{ color: "#0d2840" }}>
              The EDGE Framework
            </h2>
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
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
              <a
                href="https://www.bioedgedecoder.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2 rounded-full text-white font-heading font-medium text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#0d2840" }}
              >
                bioEDGE Decoder
              </a>
              <a
                href="http://bioedgecoach.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2 rounded-full text-white font-heading font-medium text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#017ab2" }}
              >
                bioEDGE Coach
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {systems.map((system) => {
            const Icon = system.icon
            const content = (
              <div
                className={`be-card hover:shadow-lg transition-all h-full text-center ${
                  system.available ? "cursor-pointer" : "opacity-60"
                }`}
                style={{ boxShadow: "0 0 0 2px rgba(1, 122, 178, 0.3)" }}
              >
                {/* Icon */}
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{
                    background: system.available
                      ? "linear-gradient(135deg, #017ab2 0%, #0d2840 100%)"
                      : "#e5e7eb",
                    boxShadow: "0 0 0 4px rgba(1, 122, 178, 0.2)",
                  }}
                >
                  <Icon className={`h-8 w-8 ${system.available ? "text-white" : "text-gray-400"}`} />
                </div>

                {/* Name */}
                <h2 className="font-heading font-semibold mb-1" style={{ color: "#0d2840" }}>
                  {system.name}
                </h2>

                {/* Tagline */}
                <p className="text-sm mt-1" style={{ color: "#017ab2" }}>
                  {system.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-text-light mt-2">
                  {system.description}
                </p>

                {!system.available && (
                  <span className="inline-block text-xs font-heading uppercase tracking-wide text-text-light bg-gray-100 px-2 py-1 rounded mt-3">
                    Coming Soon
                  </span>
                )}
              </div>
            )

            if (system.available) {
              return (
                <Link key={system.slug} href={`/systems/${system.slug}`}>
                  {content}
                </Link>
              )
            }

            return <div key={system.slug}>{content}</div>
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
