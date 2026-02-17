import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SystemDirectory } from "@/components/directory/system-solutions"
import { SystemNews } from "@/components/directory/system-news"

/**
 * Defense System Page
 *
 * Your Body's Intelligent Shield - immune function, inflammation, autoimmunity
 * Part of the bioEDGE Decoder 15 Systems Framework.
 */
export default function DefenseSystemPage() {
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
            Back to All Systems
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Defense System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Intelligent Shield
          </p>
          <p className="text-sm text-gold mt-4 font-heading uppercase tracking-wider">
            bioEDGE Decoder
          </p>
        </div>
      </div>

      {/* Section Nav */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="be-container">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-x-6 gap-y-2 py-3 text-sm">
            <a href="#natural-intelligence" className="text-electric-blue hover:text-navy transition-colors">Natural Intelligence</a>
            <a href="#eliminate" className="text-electric-blue hover:text-navy transition-colors">Eliminate</a>
            <a href="#decode" className="text-electric-blue hover:text-navy transition-colors">Decode</a>
            <a href="#gain" className="text-electric-blue hover:text-navy transition-colors">Gain</a>
            <a href="#execute" className="text-electric-blue hover:text-navy transition-colors">Execute</a>
            <a href="#questions" className="text-electric-blue hover:text-navy transition-colors">Questions</a>
            <a href="#connections" className="text-electric-blue hover:text-navy transition-colors">Connections</a>
            <a href="#news" className="text-electric-blue hover:text-navy transition-colors">News</a>
            <a href="#directory" className="text-electric-blue hover:text-navy transition-colors">Directory</a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="be-container py-12">
        <div className="max-w-3xl mx-auto">
          <article className="space-y-8 body-text">

            {/* Natural Intelligence */}

            <div id="natural-intelligence" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Natural Intelligence
              </h2>
            </div>

            <p>
              Your body operates a sophisticated surveillance network more complex than any security system ever designed. Right now, as you read this, immune cells are patrolling 37 trillion cells, distinguishing self from other, friend from foe, in decisions that execute faster than thought.
            </p>

            <p>
              The Defense System governs protection against pathogens and the management of inflammation. Its core function is to protect: identifying what doesn&apos;t belong, neutralizing threats, and repairing damage.
            </p>

            <p>
              <strong className="text-navy">What makes this system remarkable among the fourteen biological systems is its dual capacity for precision and proportionality.</strong> When functioning well, your Defense System mounts strong responses to genuine threats and stands down when those threats pass. It knows the difference between a splinter and a virus, between pollen and a pathogen, between your own tissue and foreign invaders.
            </p>

            <p>
              Inflammation is its primary tool—beneficial when acute, destructive when chronic. A fever isn&apos;t a malfunction; it&apos;s an intentional immune response. Your body raises its temperature because most pathogens can&apos;t survive the heat. A cut swells and reddens because immune cells are flooding the area, bringing reinforcements and building supplies for repair.
            </p>

            <p>
              This is the psychophysiological supersystem at work. Your endocrine system, nervous system, and immune system don&apos;t operate in isolation. They communicate constantly through shared chemical messengers. When you face a threat, this network responds as one. Cut your finger, and your nervous system signals pain to protect the area. Your endocrine system releases clotting factors. Your immune system dispatches white blood cells to prevent infection. No committee meetings. No filed reports. Coordinated response without conscious direction.
            </p>

            <p>
              Consider how ancient this intelligence is. By the time humans appeared, the immune system had already been refined for half a billion years. You inherited this. The wisdom encoded in your Defense System carries intelligence accumulated across evolutionary time.
            </p>

            <p>
              Your body already knows how to protect you. The signals it sends are information, not failures. The question is whether you&apos;re listening.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              The following factors may warrant examination when exploring signals that might originate from your Defense System. These are not causes or diagnoses—they are considerations worth investigating.
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prolonged inactivity, which might contribute to inflammatory accumulation</li>
              <li>Excessive exercise without adequate recovery, which may deplete immune resources</li>
              <li>Sleep disruption, as immune repair and regulation often occur during rest</li>
              <li>Irregular schedules that may affect circadian rhythm governing immune cell activity</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Highly processed foods, refined sugars, and industrial seed oils</li>
              <li>Foods you may have developed sensitivities to</li>
              <li>Timing, speed of eating, and nervous system state during meals</li>
              <li>Gut-immune interactions (the gut houses 70-80% of your immune system)</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Water-damaged buildings and mold exposure</li>
              <li>Poor air quality and chemical-laden environments</li>
              <li>Workplace exposures and home environments</li>
              <li>Air quality in spaces where you spend significant time</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chronic interpersonal stress influencing immune regulation</li>
              <li>Suppressed emotions and unresolved conflicts</li>
              <li>Relationships that consistently activate stress response</li>
              <li>Social isolation (associated with immune dysfunction)</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chronic overwork and pushing through illness</li>
              <li>Ignoring early signals and patterns of self-neglect</li>
              <li>The story you tell yourself about rest (earned vs. wasteful)</li>
              <li>How you respond to immune signals</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Screen time and notification patterns disrupting sleep</li>
              <li>Blue light exposure at night affecting circadian rhythms</li>
              <li>Stress of constant connectivity</li>
              <li>Displacement of restorative activities</li>
            </ul>

            {/* Decode */}

            <div id="decode" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Decode
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Understand what your body is communicating</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Signal Inventory</h3>

            <p>
              The Defense System communicates through 26 signals organized across 9 categories:
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Acute Inflammatory Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Localized swelling</li>
              <li>Localized heat</li>
              <li>Redness or erythema</li>
              <li>Fever or elevated temperature</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Chronic Inflammatory Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Persistent joint pain</li>
              <li>Chronic fatigue that doesn&apos;t improve with rest</li>
              <li>Brain fog or mental cloudiness</li>
              <li>Chronic skin issues (eczema, psoriasis, rashes)</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Immune Activation Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Frequent illness or getting sick often</li>
              <li>Swollen lymph nodes</li>
              <li>Night sweats</li>
              <li>Prolonged recovery from illness</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Allergic &amp; Hypersensitivity (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Environmental allergies (pollen, dust, mold)</li>
              <li>Food reactions or sensitivities</li>
              <li>Hives or urticaria</li>
              <li>Chemical sensitivity</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Autoimmune &amp; Self-Attack (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Feeling of body attacking itself</li>
              <li>Systemic inflammation patterns (multiple systems)</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Gut-Immune Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Gut inflammation / &quot;leaky gut&quot; patterns</li>
              <li>Post-meal immune activation</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Healing Response Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Slow wound healing</li>
              <li>Abnormal scarring patterns (keloids)</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Immune Depletion Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Post-exertional malaise</li>
              <li>Reactive / hypervigilant immune system</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Infection Signals (2)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Low-grade persistent feeling of being sick</li>
              <li>Reactivation patterns (cold sores recurring)</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You notice joint stiffness in the morning. It takes a while to get moving. Your fingers feel puffy.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your body has already responded—there&apos;s inflammation present, immune cells are active, fluid has accumulated.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> &quot;I&apos;m getting old.&quot; &quot;This is just arthritis.&quot; &quot;I must have slept wrong.&quot; &quot;Everyone in my family has joint problems.&quot; &quot;I need to push through.&quot; &quot;It&apos;s nothing.&quot;
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> Is there heat or swelling present? Does the stiffness last more than 30 minutes? Did this cluster with other inflammatory signals—fatigue, brain fog, skin issues? What was I eating, how stressed was I, what exposures occurred before this started? Did this begin after an infection or illness?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> You remember this differently. Morning stiffness isn&apos;t who you are. It&apos;s information. Your body was telling you something about inflammatory load. The signal was accurate. The original story was incomplete.
            </p>

            <p>
              Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life. This doesn&apos;t stop with your health. This can apply to your career, your family, your friends, anything.
            </p>

            <h3 className="font-heading font-bold text-navy">Common Mislabels</h3>

            <p>
              Defense System signals are frequently attributed to other causes. The following patterns may be worth exploring:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 font-heading text-navy">What It Gets Called</th>
                    <th className="text-left py-3 font-heading text-navy">What It Might Be Worth Exploring</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Laziness, depression, &quot;just tired&quot;</td>
                    <td className="py-3">Chronic fatigue from inflammation that doesn&apos;t improve with rest</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">ADHD, early dementia, aging</td>
                    <td className="py-3">Brain fog accompanied by other inflammatory markers</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Hypochondria, &quot;making it up,&quot; picky eating</td>
                    <td className="py-3">Food sensitivities producing real immune responses</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Anxiety disorder, &quot;too sensitive,&quot; hysteria</td>
                    <td className="py-3">Multiple chemical sensitivity with measurable reactions</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Deconditioning, lack of willpower</td>
                    <td className="py-3">Post-exertional malaise—worsening after activity</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Labs are normal,&quot; psychosomatic</td>
                    <td className="py-3">Autoimmune patterns not yet captured by standard testing</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Normal aging, &quot;arthritis runs in the family&quot;</td>
                    <td className="py-3">Inflammatory joint pain that may respond to triggers</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Weak constitution, bad luck</td>
                    <td className="py-3">Frequent illness indicating depleted immune resources</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Panic disorder, &quot;just sensitive&quot;</td>
                    <td className="py-3">Histamine or mast cell patterns producing physical symptoms</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Multiple separate diagnoses</td>
                    <td className="py-3">Systemic inflammation affecting multiple systems</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Stress, &quot;nervous reaction&quot;</td>
                    <td className="py-3">Hives and urticaria from mast cell activation</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Poor self-care, &quot;just how you heal&quot;</td>
                    <td className="py-3">Slow wound healing indicating immune dysfunction</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Menopause, anxiety</td>
                    <td className="py-3">Night sweats indicating chronic immune activation</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Anxiety, hypervigilance (psychological)</td>
                    <td className="py-3">Reactive immune system with real inflammatory responses</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Gain */}

            <div id="gain" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Gain
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Explore supportive practices and resources</p>
            </div>

            <p>
              The following represent options worth exploring. These are not prescriptions—they are invitations to investigate.
            </p>

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Observe timing patterns—signals worsening in the morning suggest inflammation</li>
              <li>Notice signals that flare after meals (food-related immune activation)</li>
              <li>Track patterns correlating with stress, weather, or environments</li>
              <li>Notice clusters: joint pain + fatigue + brain fog + skin issues together</li>
              <li>Track what happens after exertion—normal fatigue vs. post-exertional malaise</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Elimination approaches for food-related triggers</li>
              <li>Stress reduction practices (given stress-immune communication)</li>
              <li>Movement appropriate to current capacity</li>
              <li>Rest as a practice, not just when you collapse</li>
              <li>Observing what shifts when potential triggers are removed</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Air quality in living and working spaces</li>
              <li>Reducing chemical exposure (fragrances, cleaning products)</li>
              <li>Addressing water damage or potential mold issues</li>
              <li>Examining personal care products for burden</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Immunologists and rheumatologists</li>
              <li>Allergists</li>
              <li>Functional medicine practitioners (chronic inflammatory patterns)</li>
              <li>Naturopathic physicians</li>
              <li>Environmental medicine practitioners</li>
              <li>Integrative practitioners who consider the whole picture</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <p>Simple daily anchors that may support immune function:</p>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Consistent sleep pattern.</strong> Adequate sleep in a regular rhythm, as immune repair occurs during rest.</li>
              <li><strong className="text-navy">Appropriate movement.</strong> Regular activity matched to your current capacity—not pushing through signals.</li>
              <li><strong className="text-navy">Non-triggering meals.</strong> Eating foods that don&apos;t provoke obvious reactions.</li>
              <li><strong className="text-navy">Time outdoors.</strong> Natural settings where your nervous system can settle.</li>
              <li><strong className="text-navy">Genuine rest.</strong> Periods where you truly recover, not just collapse.</li>
            </ol>

            <p>
              Consistency matters more than intensity. Small practices maintained over time often outperform dramatic interventions that can&apos;t be sustained.
            </p>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>This is observation, not optimization. You&apos;re building a relationship with your body&apos;s signals:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>What you eat and how you feel in the hours and days afterward</li>
              <li>Sleep quality and how you feel upon waking</li>
              <li>When signals appear, worsen, or improve</li>
              <li>What was happening in your environment before a flare</li>
              <li>How long morning stiffness lasts</li>
              <li>Whether rest helps or doesn&apos;t change things</li>
            </ul>

            <p className="text-sm italic">
              This isn&apos;t about perfect data. It&apos;s about pattern recognition over time.
            </p>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              The Defense System operates on its own timeline. Immune rebalancing doesn&apos;t happen in days. Changes to inflammatory patterns may take weeks to months to become apparent. If your immune system has been dysregulated for years, resolution won&apos;t arrive overnight.
            </p>

            <p>
              Inflammation accumulated slowly often resolves slowly. Triggers removed today may show effects weeks from now. This is frustrating when you want answers and improvement now.
            </p>

            <p>
              Trust the process. Notice small shifts, not just dramatic changes. Sometimes &quot;less bad&quot; is the first sign that something is moving in the right direction.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              These questions may help explore whether a signal originates from your Defense System:
            </p>

            <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is there visible or measurable inflammation—swelling, heat, redness?</li>
              <li>Does this signal cluster with other inflammatory markers?</li>
              <li>Does morning stiffness last more than 30 minutes?</li>
              <li>Does rest help this fatigue? (If no, points to Defense)</li>
              <li>Is there post-exertional malaise—worsening hours or days after activity?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Deeper Investigation</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Do anti-inflammatory approaches help?</li>
              <li>Are there identified triggers—foods, chemicals, environments?</li>
              <li>Did this start after an infection, toxic exposure, or triggering event?</li>
              <li>Are sensitivities multiplying over time?</li>
              <li>Is there a pattern of immune signals together?</li>
            </ol>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Defense System interfaces with multiple other systems, reflecting the psychophysiological supersystem:
            </p>

            <p>
              <strong className="text-navy">Energy Production</strong> — Chronic inflammation depletes cellular energy resources. Inflammatory fatigue and post-exertional malaise involve both systems. When immune activity consumes energy, less remains for everything else.
            </p>

            <p>
              <strong className="text-navy">Stress Response</strong> — The nervous system and immune system share chemical messengers. Stress lowers the threshold for immune reactions—autoimmune flares, allergic responses, and hives often worsen during stressful periods.
            </p>

            <p>
              <strong className="text-navy">Digestive</strong> — 70-80% of immune tissue resides in the gut. Gut inflammation affects systemic immune function. Food sensitivities develop when gut barrier integrity is compromised.
            </p>

            <p>
              <strong className="text-navy">Detoxification</strong> — Chronic inflammatory response syndrome (CIRS) patterns involve both toxic burden and immune response. Mold exposure triggers immune activation. The liver&apos;s detoxification capacity affects inflammatory load.
            </p>

            <p>
              <strong className="text-navy">Hormonal</strong> — Hormones modulate immune function. Autoimmune conditions show gender differences related to hormonal patterns. Thyroid dysfunction and immune dysregulation often co-occur.
            </p>

            <p>
              <strong className="text-navy">Consciousness</strong> — Brain fog from inflammation reflects how cytokines (immune messengers) cross into the brain and affect cognitive function. Inflammation-driven mood changes have a flat quality distinct from emotional processing.
            </p>


            <Suspense fallback={null}>
              <SystemNews system="Defense" label="Defense" />
            </Suspense>

            <Suspense fallback={null}>
              <SystemDirectory system="Defense" label="Defense" />
            </Suspense>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your Defense System carries intelligence accumulated across half a billion years of evolution. It knows how to protect you, repair damage, and distinguish friend from foe. The signals it sends are information, not failures.
              </p>
              <p className="mt-4 italic">
                Your job is to listen, decode, and respond—trusting that your body already knows how.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/consciousness"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Consciousness
            </Link>
            <Link
              href="/systems/detoxification"
              className="inline-flex items-center gap-2 text-sm text-[#017ab2] hover:text-navy transition-colors font-medium"
            >
              Next: Detoxification
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Defense System | bioEDGE Decoder",
  description: "Your Body's Intelligent Shield. The Defense System governs protection against pathogens and the management of inflammation—identifying what doesn't belong, neutralizing threats, and repairing damage.",
}
