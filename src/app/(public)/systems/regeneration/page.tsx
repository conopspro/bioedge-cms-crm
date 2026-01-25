import Link from "next/link"
import {
  RefreshCw,
  AlertCircle,
  Search,
  Sparkles,
  Play,
  HelpCircle,
  LinkIcon,
  ArrowLeft,
} from "lucide-react"

/**
 * Regeneration System Page
 *
 * Part of the bioEDGE Decoder 15 Biological Systems Framework.
 * Covers cellular repair, stem cells, and longevity pathways.
 */

export default function RegenerationSystemPage() {
  return (
    <>
      {/* Hero */}
      <div className="be-event-hero">
        <div className="be-container py-16 relative z-10">

            <Link
              href="/systems"
              className="inline-flex items-center gap-2 text-white/70 hover:text-gold mb-6 text-sm font-heading"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Systems
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur">
                <RefreshCw className="h-8 w-8 text-gold" />
              </div>
              <p className="text-sm text-gold font-heading uppercase tracking-wider">
                bioEDGE Decoder
              </p>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Regeneration System
            </h1>
            <p className="text-xl text-white/80">
              Your Body&apos;s Rebuild Crew
            </p>
        </div>
      </div>

      {/* Content */}
      <div className="be-container py-12">

          {/* Section 1: Natural Intelligence */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                1
              </span>
              <h2 className="section-title">Natural Intelligence</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="body-text mb-4">
                Your body is rebuilding itself right now. While you read this sentence, millions of cells are being dismantled and replaced. Damaged proteins are being cleared. Microscopic tears in tissue are being stitched together with fresh collagen. You didn&apos;t initiate any of this. You don&apos;t supervise it. It happens because your body carries ancient wisdom about repair.
              </p>
              <p className="body-text mb-4">
                The Regeneration System governs <strong>rebuilding</strong>. It replaces damaged cells, repairs tissue after injury or exertion, and maintains your structural integrity over time. This is distinct from the energy that powers your activity, distinct from the structure being repaired, distinct from the inflammatory response that precedes repair. This system is specifically about the rebuild.
              </p>
              <p className="body-text mb-4">
                <strong>Sleep is the primary regeneration window.</strong> When you close your eyes and consciousness dims, growth hormone surges and cellular repair accelerates. Your brain activates a glymphatic cleaning system that flushes metabolic waste from neural tissue. Your muscles synthesize protein. Your bones remodel. The night shift takes over.
              </p>
              <p className="body-text mb-4">
                What makes this system remarkable among the fourteen is its dependence on absence. Regeneration requires what you <em>stop doing</em> as much as what you do. It needs gaps in activity, periods of rest, windows where the body isn&apos;t responding to demands and can instead tend to maintenance. In a culture of constant productivity, this may be the most countercultural system of all.
              </p>
              <p className="body-text mb-4">
                The Regeneration System is part of your unified healing network, your psychophysiological supersystem where hormones, nerves, and immune cells speak the same chemical language. When you&apos;re injured, your endocrine system releases clotting factors while your immune system dispatches white blood cells while your nervous system signals pain to protect the area. They don&apos;t hold committee meetings. They act in concert, executing coordinated responses without conscious direction.
              </p>
              <p className="body-text mb-4">
                Your body already knows how to rebuild. It has been doing so since before you were born, guided by intelligence accumulated across billions of years of evolution. Your mitochondria, those ancient bacterial descendants in every cell, carry their own DNA passed down through mothers, encoding wisdom accumulated across two billion years. This is the depth of time working on your behalf whenever repair is needed.
              </p>
              <p className="body-text">
                The signals that arise when regeneration is compromised aren&apos;t failures. They&apos;re accurate reports from a system working exactly as designed, communicating that the rebuild crew needs different conditions to do its work.
              </p>
            </div>
          </section>

          {/* Section 2: Eliminate */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                2
              </span>
              <h2 className="section-title">Eliminate</h2>
            </div>

            <p className="body-text mb-6">
              Before exploring what might support regeneration, consider what might be interfering with it. The factors below aren&apos;t causes or diagnoses. They&apos;re considerations worth examining.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Lifestyle Factors
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Activity patterns that never include true rest periods</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Chronic sleep restriction or irregular sleep timing</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Exercise that consistently exceeds recovery capacity</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Work schedules that fragment sleep windows</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Patterns of pushing through fatigue rather than responding to it</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Lack of distinction between work time and rest time</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Dietary Considerations
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Protein intake inadequate for tissue repair needs</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Eating patterns that don&apos;t support overnight fasting and autophagy</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Excessive alcohol, disrupting sleep architecture and growth hormone release</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Blood sugar dysregulation affecting overnight repair processes</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Nutrient deficiencies impairing collagen synthesis or cellular repair</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Eating too close to sleep, diverting resources to digestion</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Environmental Interference
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Light exposure at night disrupting melatonin and sleep quality</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Bedroom temperature too warm for optimal sleep</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Noise that fragments sleep without full waking</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Air quality issues that tax the body overnight</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Sleeping surfaces creating discomfort and microawakenings</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Environments that don&apos;t permit genuine rest</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Relationship & Emotional Patterns
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Chronic stress states keeping cortisol elevated (cortisol is catabolic)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Suppressed grief or loss that the body holds</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Relationship dynamics that prevent relaxation</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Emotional hypervigilance interfering with deep rest</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Unprocessed trauma stored in the body</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Patterns of caretaking leaving nothing for self-repair</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Habitual Patterns
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Caffeine timing that disrupts sleep depth</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Evening screen habits that delay sleep onset</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Exercise timing that interferes with sleep quality</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Chronic overcommitment leaving no margin for recovery</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Perfectionism that prevents &quot;good enough&quot; rest</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Ignoring fatigue signals until collapse</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Digital Interference
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Blue light exposure suppressing melatonin production</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Notification patterns that fragment rest periods</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Screen time that substitutes for sleep time</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Work emails accessed in bed</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Social media scrolling activating stress response before sleep</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>Digital entertainment replacing restorative downtime</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Decode */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                3
              </span>
              <h2 className="section-title">Decode</h2>
            </div>

            {/* Signal Inventory */}
            <div className="be-card mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Search className="h-5 w-5 text-electric-blue" />
                <h3 className="font-heading font-bold text-navy">
                  Signal Inventory
                </h3>
              </div>
              <p className="body-text mb-6">
                The Regeneration System communicates through <strong>25 distinct signals</strong> across 8 categories. These aren&apos;t problems with you. They&apos;re information from you.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Sleep & Restoration Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Non-Restorative Sleep</li>
                    <li>• Reduced Deep Sleep</li>
                    <li>• Extended Recovery Time Needed</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Workout & Exertion Recovery (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Prolonged Post-Exercise Soreness</li>
                    <li>• Decreased Exercise Tolerance</li>
                    <li>• Muscle Not Building Despite Training</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Wound & Injury Healing (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Slow Wound Healing</li>
                    <li>• Slow Injury Recovery</li>
                    <li>• Scarring More Than Expected</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Tissue Quality & Integrity (4)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Skin Thinning or Fragility</li>
                    <li>• Loss of Tissue Elasticity</li>
                    <li>• Hair Loss or Thinning</li>
                    <li>• Nail Changes</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Cellular Renewal Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Premature Aging Signs</li>
                    <li>• Slow Recovery from Illness</li>
                    <li>• Decreased Healing Response to Therapies</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Growth & Development Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Muscle Wasting Despite Activity</li>
                    <li>• Bone Density Loss</li>
                    <li>• Cartilage Degradation</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Recovery Capacity Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Diminished Stress Recovery</li>
                    <li>• Reduced Adaptive Capacity</li>
                    <li>• Poor Recovery from Travel</li>
                  </ul>
                </div>

                <div className="bg-background-alt rounded-lg p-4">
                  <h4 className="font-heading font-bold text-navy text-sm mb-2">
                    Restorative Process Signals (3)
                  </h4>
                  <ul className="body-text space-y-1">
                    <li>• Can&apos;t Nap or Rest Effectively</li>
                    <li>• Recovery Requires Excessive Resources</li>
                    <li>• Post-Exertional Malaise</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* TRADE Framework */}
            <div className="be-card mb-8">
              <h3 className="font-heading font-bold text-navy mb-4">
                The TRADE Framework
              </h3>
              <p className="body-text mb-6">
                Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-white font-heading font-bold text-sm flex-shrink-0">
                    T
                  </span>
                  <div>
                    <p className="font-heading font-bold text-navy">Trigger</p>
                    <p className="body-text">
                      You wake up after eight hours of sleep. Your eyes open, and instead of feeling restored, you feel as if you barely slept at all. Same exhaustion as when you went to bed. Your body is reporting something.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-white font-heading font-bold text-sm flex-shrink-0">
                    R
                  </span>
                  <div>
                    <p className="font-heading font-bold text-navy">React</p>
                    <p className="body-text">
                      Your chest tightens. Frustration rises. You drag yourself out of bed, reach for coffee, push through the fog. Your body is responding to the signal with its own cascade.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold text-white font-heading font-bold text-sm flex-shrink-0">
                    A
                  </span>
                  <div>
                    <p className="font-heading font-bold text-navy">Assume</p>
                    <p className="body-text">
                      Your mind assigns a story: &quot;I&apos;m just tired. I didn&apos;t sleep well. I&apos;m getting old. I need better sleep hygiene. There&apos;s something wrong with me. This is just how I am now.&quot;
                    </p>
                  </div>
                </div>

                <div className="bg-pink-accent/10 border border-pink-accent/20 rounded-lg p-4 my-4">
                  <p className="body-text">
                    Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong className="text-pink-accent">TRAP</strong>, paralyzed.
                  </p>
                </div>

                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">
                    D
                  </span>
                  <div>
                    <p className="font-heading font-bold text-navy">Decode</p>
                    <p className="body-text">
                      Instead of accepting the story, you investigate. Is sleep actually occurring but not restoring? Have I been sleeping enough hours but waking exhausted for weeks or months? Did this pattern start after something—an illness, a stressful period, a change in routine? Does rest help somewhat, or not at all? Is this specifically about overnight recovery, or is my energy low regardless? Are there other signals—slow healing, prolonged soreness, changes in tissue quality? What might be interfering with the repair processes that sleep is supposed to enable?
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-electric-blue text-white font-heading font-bold text-sm flex-shrink-0">
                    E
                  </span>
                  <div>
                    <p className="font-heading font-bold text-navy">Encode</p>
                    <p className="body-text">
                      The next time you wake unrefreshed, you remember differently. This isn&apos;t a verdict on my character or my future. This is my body accurately reporting that restoration didn&apos;t complete. Something about my sleep architecture, my recovery capacity, or my regeneration resources may need attention. I can investigate this like any other signal—with curiosity rather than despair.
                    </p>
                  </div>
                </div>
              </div>

              <p className="body-text mt-6">
                Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life. This doesn&apos;t stop with your health. This can apply to your career, your family, your friends, anything.
              </p>
            </div>

            {/* Common Mislabels */}
            <div className="be-card">
              <h3 className="font-heading font-bold text-navy mb-4">
                Common Mislabels
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full body-text">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 pr-4 font-heading font-bold text-navy">
                        What It Gets Called
                      </th>
                      <th className="text-left py-3 font-heading font-bold text-navy">
                        What It Might Be Worth Exploring
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Insomnia, depression, &quot;just tired,&quot; laziness</td>
                      <td className="py-3">Non-restorative sleep—whether sleep is occurring but restoration isn&apos;t completing</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Light sleeper (trait), anxiety, normal aging</td>
                      <td className="py-3">Reduced deep sleep phases—whether sleep architecture has changed</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Deconditioning, out of shape, &quot;needs to push through&quot;</td>
                      <td className="py-3">Extended recovery time—whether the body needs longer rest periods between efforts</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Overtraining, injury, &quot;worked out too hard&quot;</td>
                      <td className="py-3">Prolonged post-exercise soreness—whether tissue repair is taking longer than expected</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Need to push harder, lack of motivation</td>
                      <td className="py-3">Decreased exercise tolerance—whether recovery capacity has shifted</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Genetics, wrong program, &quot;hard gainer&quot;</td>
                      <td className="py-3">Whether training stimulus is present but rebuild isn&apos;t completing</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Diabetes, poor circulation, old age</td>
                      <td className="py-3">Slow wound healing—whether the repair process itself is impaired</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Incomplete rehab, not resting enough</td>
                      <td className="py-3">Slow injury recovery—whether healing timelines have extended</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Normal aging, sun damage, genetics</td>
                      <td className="py-3">Skin thinning or tissue changes—whether regeneration has slowed</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">&quot;Just getting older,&quot; character flaw</td>
                      <td className="py-3">Premature aging signs—whether multiple tissue systems are declining faster than expected</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Weak immune system, depression</td>
                      <td className="py-3">Slow recovery from illness—whether post-illness rebuilding is delayed</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Sarcopenia, normal aging, not trying hard enough</td>
                      <td className="py-3">Muscle wasting—whether breakdown is exceeding repair despite adequate stimulus</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Menopause only, calcium deficiency only</td>
                      <td className="py-3">Bone density loss—whether bone remodeling balance has shifted</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Normal wear and tear, &quot;just arthritis&quot;</td>
                      <td className="py-3">Cartilage degradation—whether joint cushioning regeneration is impaired</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Poor coping skills, weakness, anxiety</td>
                      <td className="py-3">Diminished stress recovery—whether physical recovery from stress is extending</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4">Deconditioning, laziness, malingering</td>
                      <td className="py-3">Post-exertional malaise—whether exertion causes delayed, disproportionate crashes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 4: Gain */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                4
              </span>
              <h2 className="section-title">Gain</h2>
            </div>

            <p className="body-text mb-6">
              The following are options to explore, not prescriptions. What supports regeneration for one person may not suit another.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="be-card">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Awareness Tools
                  </h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Sleep tracking that captures more than duration—noticing how you feel upon waking, not just how long you slept</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Observing which nights leave you feeling restored versus depleted</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Noting the timeline of recovery after physical effort</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Paying attention to how long minor wounds take to heal compared to earlier in life</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Tracking tissue quality changes over months rather than days</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Noticing the relationship between rest quality and next-day capacity</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-3 mb-4">
                  <Play className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Exploratory Practices
                  </h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Experimenting with sleep timing and duration to find your restoration window</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Exploring different recovery protocols after exertion—active rest, complete rest, varying intensities</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Investigating protein timing and amounts</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Exploring temperature manipulation—cold exposure, heat therapy, contrast approaches</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Testing different wind-down routines before sleep</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Experimenting with recovery ratios relative to training load</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Environmental Adjustments
                  </h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Optimizing the sleep environment—darkness, temperature, quiet, air quality</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Creating spaces that genuinely permit rest</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Reducing light exposure in evening hours</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Considering the sleeping surface and its support</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Establishing boundaries between work spaces and rest spaces</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Creating recovery zones in your living environment</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="h-5 w-5 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Professional Resources
                  </h3>
                </div>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Sleep specialists who investigate sleep architecture beyond duration</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Functional medicine practitioners exploring root causes of impaired regeneration</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Physical therapists who understand recovery physiology</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Nutritional professionals assessing protein and micronutrient status</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Practitioners trained in manual therapies supporting tissue repair</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold">•</span>
                    <span>Practitioners familiar with post-exertional malaise and conditions affecting regeneration</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Execute */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                5
              </span>
              <h2 className="section-title">Execute</h2>
            </div>

            <div className="space-y-6">
              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Foundation Practices
                </h3>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Consistent sleep timing that honors your body&apos;s rhythms—aiming to sleep and wake at similar times most days</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Adequate sleep duration for your individual needs, which may be more than average if regeneration is compromised</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Some form of movement matched to your current recovery capacity</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Sufficient protein intake distributed across the day</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>Genuine rest periods that aren&apos;t just &quot;less activity&quot; but actual restoration time</span>
                  </li>
                </ul>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  Tracking What You Notice
                </h3>
                <p className="body-text mb-4">
                  Rather than optimizing metrics, simply observe:
                </p>
                <ul className="space-y-3 body-text">
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>How do you feel upon waking?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>How long does post-effort soreness persist?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>How quickly do minor wounds heal?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>What&apos;s your energy trajectory through the day?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>How many hours of sleep leave you feeling restored versus depleted?</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>What conditions seem to support better recovery?</span>
                  </li>
                </ul>
                <p className="body-text mt-4 italic">
                  This isn&apos;t data to perfect. It&apos;s information to notice.
                </p>
              </div>

              <div className="be-card">
                <h3 className="font-heading font-bold text-navy mb-4">
                  The Patience Principle
                </h3>
                <p className="body-text mb-4">
                  Regeneration operates on its own timeline, often slower than we wish. Sleep architecture can take weeks to shift. Tissue quality changes over months. Wound healing speed reflects cumulative factors that don&apos;t reverse overnight.
                </p>
                <p className="body-text mb-4">
                  The body&apos;s rebuild capacity can improve, but it does so gradually. Consistency matters more than intensity. Sustainable practices maintained over time will reveal what dramatic interventions cannot.
                </p>
                <p className="body-text">
                  If you&apos;ve been running a regeneration deficit for years, patience with the rebuilding process is part of the practice.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Questions for Clarity */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                6
              </span>
              <h2 className="section-title">Questions for Clarity</h2>
            </div>

            <p className="body-text mb-6">
              These questions aren&apos;t diagnostic. They&apos;re invitations to explore what might be originating from your Regeneration System versus another system.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is this about recovering from something or energy to do something?</strong>
                  <br />Recovery after exertion, injury, or illness points toward Regeneration. Lack of energy to perform activity may point toward Energy Production.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does adequate rest or sleep improve this signal?</strong>
                  <br />If rest helps but doesn&apos;t fully restore you to baseline, Regeneration may be involved. If no improvement despite adequate rest, this strongly suggests exploring Regeneration.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is there an inflammatory component—swelling, redness, heat, acute pain?</strong>
                  <br />If yes, consider the Defense System first. If inflammation has resolved but healing hasn&apos;t completed, Regeneration becomes more likely.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does this involve healing or repair taking longer than expected?</strong>
                  <br />Extended timelines for wounds, injuries, or illness recovery point toward Regeneration.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does this involve tissue quality deterioration?</strong>
                  <br />Skin, hair, nails, muscle, or bone thinning, weakening, or degrading suggests Regeneration may be involved.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is non-restorative sleep a major factor?</strong>
                  <br />Sleep that occurs but doesn&apos;t restore points toward Regeneration. Can&apos;t fall asleep due to racing mind may point toward the Stress System. Waking frequently with hot flashes may involve the Hormonal System.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does exertion cause disproportionate or delayed setback?</strong>
                  <br />Crashes appearing 12-72 hours after exertion are a classic Regeneration pattern. Immediate exhaustion during activity may point toward Energy Production.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Does the signal worsen significantly with sleep deprivation?</strong>
                  <br />If yes, Regeneration is likely involved, since sleep is the primary repair window.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Is there a pattern of breaking down faster than building up?</strong>
                  <br />Losing tissue or strength despite adequate use and nutrition points toward Regeneration. If hormonal decline is also documented, the Hormonal System may be a co-factor.
                </p>
              </div>

              <div className="be-card">
                <p className="body-text">
                  <strong className="text-navy">Are multiple regeneration-related signals present together?</strong>
                  <br />Signals across categories—sleep, healing, tissue quality, recovery—appearing together suggest systemic Regeneration involvement.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Cross-System Connections */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-white font-heading font-bold text-sm">
                7
              </span>
              <h2 className="section-title">Cross-System Connections</h2>
            </div>

            <div className="space-y-4">
              <div className="be-card border-l-4 border-l-gold">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Energy Production System
                  </h3>
                </div>
                <p className="body-text">
                  Energy is required to power repair processes. Mitochondrial dysfunction affects both energy and regeneration. Fatigue can arise from either system, but regeneration-related fatigue specifically involves recovery not completing despite rest.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-electric-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-electric-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Defense System
                  </h3>
                </div>
                <p className="body-text">
                  Inflammation precedes regeneration; the immune response clears damage, then regeneration rebuilds. Chronic inflammation can impede repair. Slow healing may involve either system depending on whether infection is present.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-pink-accent">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-pink-accent" />
                  <h3 className="font-heading font-bold text-navy">
                    Hormonal System
                  </h3>
                </div>
                <p className="body-text">
                  Growth hormone, testosterone, and other hormones signal regeneration processes. Hormonal decline can impair rebuilding capacity. Muscle loss and bone loss may involve both systems.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-deep-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-deep-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Stress System
                  </h3>
                </div>
                <p className="body-text">
                  Chronic stress maintains catabolic (breakdown) states that oppose regeneration. Cortisol elevation impedes repair. Recovery from stress itself requires regeneration. HPA axis dysfunction affects both systems.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-gold">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-gold" />
                  <h3 className="font-heading font-bold text-navy">
                    Structure & Movement System
                  </h3>
                </div>
                <p className="body-text">
                  Regeneration repairs the structure. Disuse atrophy is a Structure issue; failure to rebuild after normal use is Regeneration. Stiffness may originate from either, depending on whether it resolves quickly with movement.
                </p>
              </div>

              <div className="be-card border-l-4 border-l-electric-blue">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-electric-blue" />
                  <h3 className="font-heading font-bold text-navy">
                    Circulation System
                  </h3>
                </div>
                <p className="body-text">
                  Blood flow delivers regeneration resources to tissues. Poor circulation impairs healing. Slow wound healing may involve either Circulation (delivery problem) or Regeneration (repair process impaired).
                </p>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="mb-12">
            <div className="be-card bg-gradient-to-br from-navy to-deep-blue text-white">
              <p className="text-lg leading-relaxed">
                Your body already knows how to rebuild. The signals that arise when regeneration is compromised aren&apos;t failures—they&apos;re accurate reports from a system working exactly as designed, communicating that the rebuild crew needs different conditions to do its work. Your role is not to override this intelligence but to listen to what it&apos;s telling you.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Link
              href="/systems/nervous-system"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              ← Nervous System
            </Link>
            <Link
              href="/systems"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              All Systems
            </Link>
            <Link
              href="/systems/stress-response"
              className="text-electric-blue hover:text-navy font-heading font-medium"
            >
              Stress Response →
            </Link>
          </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Regeneration System | bioEDGE Decoder",
  description:
    "Your Body's Rebuild Crew. Explore the bioEDGE Decoder framework for understanding cellular repair, sleep restoration, and recovery processes.",
}
