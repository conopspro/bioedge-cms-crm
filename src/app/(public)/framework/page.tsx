import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

/**
 * EDGE Framework Page
 *
 * Long-form explanation of the EDGE Framework from
 * "Biological EDGE: A Practical Guide to Longevity."
 * Designed as a clean prose page — no widget clutter.
 */
export default function EdgeFrameworkPage() {
  return (
    <>
      {/* Hero */}
      <div className="be-event-hero">
        <div className="be-container py-16 relative z-10">
          <Link
            href="/systems"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Systems
          </Link>
          <p className="text-sm text-gold font-heading uppercase tracking-wider mb-4">
            Biological EDGE
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            The EDGE Framework
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Eliminate. Decode. Gain. Execute.
          </p>
        </div>
      </div>

      {/* In-page navigation */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="be-container">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-x-6 gap-y-2 py-3 text-sm">
            <a href="#eliminate" className="text-text-light hover:text-navy transition-colors">Eliminate</a>
            <a href="#decode" className="text-text-light hover:text-navy transition-colors">Decode</a>
            <a href="#gain" className="text-text-light hover:text-navy transition-colors">Gain</a>
            <a href="#execute" className="text-text-light hover:text-navy transition-colors">Execute</a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="be-container py-12">
        <div className="max-w-3xl mx-auto">
          <article className="space-y-8 body-text">

            <p>
              We can optimize our health to thrive 120 years, if we start here:
            </p>

            <p>
              <strong className="text-navy">Eliminate</strong> what interferes. Chemical, digital, behavioral. Before you add anything, identify what&apos;s getting in the way and stop it. This is where everything starts.
            </p>

            <p>
              <strong className="text-navy">Decode</strong> your body&apos;s signals. Listen to how your fifteen systems communicate. Understand why signals get mislabeled. Improve your ability to interpret what&apos;s going on.
            </p>

            <p>
              <strong className="text-navy">Gain</strong> advantage through strategic optimization. Once interference is eliminated and signals are decoded correctly, specific tools can support your systems. Devices, supplements, foods, hormetic stressors, biohacking practices.
            </p>

            <p>
              <strong className="text-navy">Execute</strong> with intention and consistency. The best protocol in the world does nothing if you don&apos;t implement it. This is the discipline of daily practice, tracked over time, sustained long enough for your body to respond.
            </p>

            {/* --- The order matters --- */}

            <h2 className="font-heading font-bold text-2xl text-navy pt-4">
              The order matters.
            </h2>

            <p>
              Most people start at Gain. They buy supplements. They purchase devices. They seek the magic intervention that will fix everything. But adding optimization on top of ongoing interference is like mopping the floor while the faucet runs over. The tools don&apos;t work because the source isn&apos;t addressed.
            </p>

            <p>
              Others get stuck at Decode. They understand something is wrong but can&apos;t identify what. They accumulate diagnoses that don&apos;t resolve anything. They accept labels that become self-fulfilling prophecies. The signals keep coming, but the interpretation keeps missing.
            </p>

            <p>
              EDGE is a sequence. First Eliminate. Then Decode. Then Gain. Then Execute. Sometimes poor execution is its own signal. The process reveals new truths along the way. You&apos;ll loop back around a few times. Just don&apos;t skip a step or the foundation crumbles. Follow the sequence, and coherence will emerge.
            </p>

            {/* --- Eliminate --- */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>The step that costs nothing</p>
            </div>

            <p>
              Before you try to source your signals or add anything new, ask: What can I stop?
            </p>

            <p>
              Chemical interference includes processed food combinations (high saturated fat combined with refined carbohydrates and damaged seed oils from manufacturing), mouthwash that destroys the oral bacteria responsible for producing nitric oxide, environmental toxins including mold, and unnecessary medications that may be treating the wrong condition.
            </p>

            <p>
              Digital interference includes notifications fragmenting your attention, screens before bed, information overload, and algorithmic feeds designed to mold your reality.
            </p>

            <p>
              Behavioral interference includes overcommitment, erratic schedules, sedentary patterns, and relationships that drain rather than sustain.
            </p>

            <p>
              Most of what interferes with your biology is something you need to refuse.
            </p>

            <p>
              This first step costs nothing.
            </p>

            {/* --- Decode --- */}

            <div id="decode" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Decode
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Understand your body&apos;s signals</p>
            </div>

            <p>
              Your body is not broken. It is communicating.
            </p>

            <p>
              Elimination is straightforward. You identify interference, you stop it. Gain is selection. You choose tools that optimize your systems. Execution is discipline. You show up consistently.
            </p>

            <p>
              Decoding is different. It requires learning a language no one taught you. It&apos;s one your brain actively mistranslates.
            </p>

            <p>
              When a signal arrives, your brain doesn&apos;t wait for investigation. It assigns a story instantly, drawing from past experience, cultural beliefs, and whatever label feels most familiar. Fatigue becomes &ldquo;I&apos;m getting old.&rdquo; Joint pain becomes &ldquo;it runs in my family.&rdquo; Brain fog becomes &ldquo;I&apos;m just stressed.&rdquo;
            </p>

            <p>
              These labels feel like truth. They&apos;re often wrong.
            </p>

            <p>
              Your body sends accurate intelligence. Your brain misinterprets it. The skill of decoding is learning to catch the misinterpretation before it locks in and to hold the signal without the narrative long enough to investigate what&apos;s actually happening.
            </p>

            <p>
              You are the only one who can decode your signals. No practitioner, no expert, no algorithm can feel what you feel or perceive your patterns. This is why decoding gets the next chapter.
            </p>

            {/* --- Gain --- */}

            <div id="gain" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Gain
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Tools for optimization</p>
            </div>

            <p>
              Once interference is removed and you understand what signals your body is sending, you can add tools that optimize each system.
            </p>

            <p>
              This is where biohacking devices, supplements, foods, hormetic stress, and optimization strategies live. Red light therapy panels, infrared saunas, cold plunges, mitochondrial support, breathwork, sound therapy, float tanks, fasting, etc. The category is vast. The choices are endless. The marketing is relentless.
            </p>

            <p>
              This is precisely why Gain comes third, not first.
            </p>

            <p>
              Tools work best when interference is already removed. You cannot supplement your way out of a bad diet. A sleep stack cannot overcome circadian disruption. Mitochondrial support cannot outpace chronic stress.
            </p>

            <p>
              Tools work when you know what you are targeting. If you have not decoded your signals, you are guessing. Guessing is expensive.
            </p>

            {/* --- Execute --- */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Systems, not motivation</p>
            </div>

            <p>
              Knowing what to eliminate, decode, and gain means nothing without execution.
            </p>

            <p>
              This is where most people fail. Lack of consistency. This may also be an undecoded signal. Don&apos;t beat yourself up. Decode that signal too.
            </p>

            <p>
              Behavior change succeeds through systems, not motivation. Motivation fluctuates. Systems persist.
            </p>

            <p>
              Execution is showing up. Every day. Until it becomes automatic. The morning sunlight exposure. The evening wind-down routine. The movement that is built into the schedule rather than dependent on how you feel.
            </p>

            <p>
              Execution is the through line. Without it, elimination is temporary. Decoding is academic. Tools gather dust. With it, everything compounds.
            </p>

            <p>
              For help tracing signals to their source, visit{" "}
              <a
                href="https://bioedgedecoder.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-electric-blue hover:text-navy transition-colors underline"
              >
                bioedgedecoder.com
              </a>.
            </p>

            {/* --- Book --- */}

            <div className="border-t border-border pt-10 mt-10">
              <p className="font-heading font-bold text-lg text-navy mb-3">
                Biological EDGE: A Practical Guide to Longevity
              </p>
              <p className="mb-4">
                This page is adapted from Chapter 6 of the book. The full text covers all fifteen biological systems, the TRADE framework for catching signal misinterpretations, and practical protocols for each step of the sequence.
              </p>
              <a
                href="https://www.amazon.com/Biological-EDGE-Practical-Guide-Longevity-ebook/dp/B0GJQ5NDGF/ref=sr_1_1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-electric-blue hover:text-navy transition-colors font-medium"
              >
                Available on Amazon
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

          </article>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "The EDGE Framework | Biological EDGE",
  description: "Eliminate interference, Decode your body's signals, Gain strategic tools, Execute with consistency. A sequential methodology for biological optimization from Biological EDGE: A Practical Guide to Longevity.",
}
