import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SystemDirectory } from "@/components/directory/system-solutions"

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
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Systems
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Regeneration System
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Rebuild Crew
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
            <a href="#natural-intelligence" className="text-text-light hover:text-navy transition-colors">Natural Intelligence</a>
            <a href="#eliminate" className="text-text-light hover:text-navy transition-colors">Eliminate</a>
            <a href="#decode" className="text-text-light hover:text-navy transition-colors">Decode</a>
            <a href="#gain" className="text-text-light hover:text-navy transition-colors">Gain</a>
            <a href="#execute" className="text-text-light hover:text-navy transition-colors">Execute</a>
            <a href="#questions" className="text-text-light hover:text-navy transition-colors">Questions</a>
            <a href="#connections" className="text-text-light hover:text-navy transition-colors">Connections</a>
            <a href="#directory" className="text-text-light hover:text-navy transition-colors">Directory</a>
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
              Your body is rebuilding itself right now. While you read this sentence, millions of cells are being dismantled and replaced. Damaged proteins are being cleared. Microscopic tears in tissue are being stitched together with fresh collagen. You didn&apos;t initiate any of this. You don&apos;t supervise it. It happens because your body carries ancient wisdom about repair.
            </p>

            <p>
              The Regeneration System governs <strong className="text-navy">rebuilding</strong>. It replaces damaged cells, repairs tissue after injury or exertion, and maintains your structural integrity over time. This is distinct from the energy that powers your activity, distinct from the structure being repaired, distinct from the inflammatory response that precedes repair. This system is specifically about the rebuild.
            </p>

            <p>
              <strong className="text-navy">Sleep is the primary regeneration window.</strong> When you close your eyes and consciousness dims, growth hormone surges and cellular repair accelerates. Your brain activates a glymphatic cleaning system that flushes metabolic waste from neural tissue. Your muscles synthesize protein. Your bones remodel. The night shift takes over.
            </p>

            <p>
              What makes this system remarkable among the fourteen is its dependence on absence. Regeneration requires what you <em>stop doing</em> as much as what you do. It needs gaps in activity, periods of rest, windows where the body isn&apos;t responding to demands and can instead tend to maintenance. In a culture of constant productivity, this may be the most countercultural system of all.
            </p>

            <p>
              The Regeneration System is part of your unified healing network, your psychophysiological supersystem where hormones, nerves, and immune cells speak the same chemical language. When you&apos;re injured, your endocrine system releases clotting factors while your immune system dispatches white blood cells while your nervous system signals pain to protect the area. They don&apos;t hold committee meetings. They act in concert, executing coordinated responses without conscious direction.
            </p>

            <p>
              Your body already knows how to rebuild. It has been doing so since before you were born, guided by intelligence accumulated across billions of years of evolution. Your mitochondria, those ancient bacterial descendants in every cell, carry their own DNA passed down through mothers, encoding wisdom accumulated across two billion years. This is the depth of time working on your behalf whenever repair is needed.
            </p>

            <p>
              The signals that arise when regeneration is compromised aren&apos;t failures. They&apos;re accurate reports from a system working exactly as designed, communicating that the rebuild crew needs different conditions to do its work.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              Before exploring what might support regeneration, consider what might be interfering with it. The factors below aren&apos;t causes or diagnoses. They&apos;re considerations worth examining.
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Activity patterns that never include true rest periods</li>
              <li>Chronic sleep restriction or irregular sleep timing</li>
              <li>Exercise that consistently exceeds recovery capacity</li>
              <li>Work schedules that fragment sleep windows</li>
              <li>Patterns of pushing through fatigue rather than responding to it</li>
              <li>Lack of distinction between work time and rest time</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Protein intake inadequate for tissue repair needs</li>
              <li>Eating patterns that don&apos;t support overnight fasting and autophagy</li>
              <li>Excessive alcohol, disrupting sleep architecture and growth hormone release</li>
              <li>Blood sugar dysregulation affecting overnight repair processes</li>
              <li>Nutrient deficiencies impairing collagen synthesis or cellular repair</li>
              <li>Eating too close to sleep, diverting resources to digestion</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Light exposure at night disrupting melatonin and sleep quality</li>
              <li>Bedroom temperature too warm for optimal sleep</li>
              <li>Noise that fragments sleep without full waking</li>
              <li>Air quality issues that tax the body overnight</li>
              <li>Sleeping surfaces creating discomfort and microawakenings</li>
              <li>Environments that don&apos;t permit genuine rest</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chronic stress states keeping cortisol elevated (cortisol is catabolic)</li>
              <li>Suppressed grief or loss that the body holds</li>
              <li>Relationship dynamics that prevent relaxation</li>
              <li>Emotional hypervigilance interfering with deep rest</li>
              <li>Unprocessed trauma stored in the body</li>
              <li>Patterns of caretaking leaving nothing for self-repair</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Caffeine timing that disrupts sleep depth</li>
              <li>Evening screen habits that delay sleep onset</li>
              <li>Exercise timing that interferes with sleep quality</li>
              <li>Chronic overcommitment leaving no margin for recovery</li>
              <li>Perfectionism that prevents &quot;good enough&quot; rest</li>
              <li>Ignoring fatigue signals until collapse</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Blue light exposure suppressing melatonin production</li>
              <li>Notification patterns that fragment rest periods</li>
              <li>Screen time that substitutes for sleep time</li>
              <li>Work emails accessed in bed</li>
              <li>Social media scrolling activating stress response before sleep</li>
              <li>Digital entertainment replacing restorative downtime</li>
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
              The Regeneration System communicates through <strong>25 distinct signals</strong> across 8 categories. These aren&apos;t problems with you. They&apos;re information from you.
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Sleep &amp; Restoration Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Non-Restorative Sleep</li>
              <li>Reduced Deep Sleep</li>
              <li>Extended Recovery Time Needed</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Workout &amp; Exertion Recovery (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Prolonged Post-Exercise Soreness</li>
              <li>Decreased Exercise Tolerance</li>
              <li>Muscle Not Building Despite Training</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Wound &amp; Injury Healing (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Slow Wound Healing</li>
              <li>Slow Injury Recovery</li>
              <li>Scarring More Than Expected</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Tissue Quality &amp; Integrity (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Skin Thinning or Fragility</li>
              <li>Loss of Tissue Elasticity</li>
              <li>Hair Loss or Thinning</li>
              <li>Nail Changes</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Cellular Renewal Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Premature Aging Signs</li>
              <li>Slow Recovery from Illness</li>
              <li>Decreased Healing Response to Therapies</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Growth &amp; Development Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Muscle Wasting Despite Activity</li>
              <li>Bone Density Loss</li>
              <li>Cartilage Degradation</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Recovery Capacity Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Diminished Stress Recovery</li>
              <li>Reduced Adaptive Capacity</li>
              <li>Poor Recovery from Travel</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Restorative Process Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Can&apos;t Nap or Rest Effectively</li>
              <li>Recovery Requires Excessive Resources</li>
              <li>Post-Exertional Malaise</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You wake up after eight hours of sleep. Your eyes open, and instead of feeling restored, you feel as if you barely slept at all. Same exhaustion as when you went to bed. Your body is reporting something.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your chest tightens. Frustration rises. You drag yourself out of bed, reach for coffee, push through the fog. Your body is responding to the signal with its own cascade.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> Your mind assigns a story: &quot;I&apos;m just tired. I didn&apos;t sleep well. I&apos;m getting old. I need better sleep hygiene. There&apos;s something wrong with me. This is just how I am now.&quot;
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> Instead of accepting the story, you investigate. Is sleep actually occurring but not restoring? Have I been sleeping enough hours but waking exhausted for weeks or months? Did this pattern start after something—an illness, a stressful period, a change in routine? Does rest help somewhat, or not at all? Is this specifically about overnight recovery, or is my energy low regardless? Are there other signals—slow healing, prolonged soreness, changes in tissue quality? What might be interfering with the repair processes that sleep is supposed to enable?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> The next time you wake unrefreshed, you remember differently. This isn&apos;t a verdict on my character or my future. This is my body accurately reporting that restoration didn&apos;t complete. Something about my sleep architecture, my recovery capacity, or my regeneration resources may need attention. I can investigate this like any other signal—with curiosity rather than despair.
            </p>

            <p>
              Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life. This doesn&apos;t stop with your health. This can apply to your career, your family, your friends, anything.
            </p>

            <h3 className="font-heading font-bold text-navy">Common Mislabels</h3>

            <p>
              Regeneration-related signals are frequently attributed to other causes. The following patterns may be worth exploring:
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
                    <td className="py-3 pr-4">Insomnia, depression, &quot;just tired,&quot; laziness</td>
                    <td className="py-3">Non-restorative sleep—whether sleep is occurring but restoration isn&apos;t completing</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Light sleeper (trait), anxiety, normal aging</td>
                    <td className="py-3">Reduced deep sleep phases—whether sleep architecture has changed</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Deconditioning, out of shape, &quot;needs to push through&quot;</td>
                    <td className="py-3">Extended recovery time—whether the body needs longer rest periods between efforts</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Overtraining, injury, &quot;worked out too hard&quot;</td>
                    <td className="py-3">Prolonged post-exercise soreness—whether tissue repair is taking longer than expected</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Need to push harder, lack of motivation</td>
                    <td className="py-3">Decreased exercise tolerance—whether recovery capacity has shifted</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Genetics, wrong program, &quot;hard gainer&quot;</td>
                    <td className="py-3">Whether training stimulus is present but rebuild isn&apos;t completing</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Diabetes, poor circulation, old age</td>
                    <td className="py-3">Slow wound healing—whether the repair process itself is impaired</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Incomplete rehab, not resting enough</td>
                    <td className="py-3">Slow injury recovery—whether healing timelines have extended</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Normal aging, sun damage, genetics</td>
                    <td className="py-3">Skin thinning or tissue changes—whether regeneration has slowed</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Just getting older,&quot; character flaw</td>
                    <td className="py-3">Premature aging signs—whether multiple tissue systems are declining faster than expected</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Weak immune system, depression</td>
                    <td className="py-3">Slow recovery from illness—whether post-illness rebuilding is delayed</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Sarcopenia, normal aging, not trying hard enough</td>
                    <td className="py-3">Muscle wasting—whether breakdown is exceeding repair despite adequate stimulus</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Menopause only, calcium deficiency only</td>
                    <td className="py-3">Bone density loss—whether bone remodeling balance has shifted</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Normal wear and tear, &quot;just arthritis&quot;</td>
                    <td className="py-3">Cartilage degradation—whether joint cushioning regeneration is impaired</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Poor coping skills, weakness, anxiety</td>
                    <td className="py-3">Diminished stress recovery—whether physical recovery from stress is extending</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Deconditioning, laziness, malingering</td>
                    <td className="py-3">Post-exertional malaise—whether exertion causes delayed, disproportionate crashes</td>
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
              The following are options to explore, not prescriptions. What supports regeneration for one person may not suit another.
            </p>

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sleep tracking that captures more than duration—noticing how you feel upon waking, not just how long you slept</li>
              <li>Observing which nights leave you feeling restored versus depleted</li>
              <li>Noting the timeline of recovery after physical effort</li>
              <li>Paying attention to how long minor wounds take to heal compared to earlier in life</li>
              <li>Tracking tissue quality changes over months rather than days</li>
              <li>Noticing the relationship between rest quality and next-day capacity</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Experimenting with sleep timing and duration to find your restoration window</li>
              <li>Exploring different recovery protocols after exertion—active rest, complete rest, varying intensities</li>
              <li>Investigating protein timing and amounts</li>
              <li>Exploring temperature manipulation—cold exposure, heat therapy, contrast approaches</li>
              <li>Testing different wind-down routines before sleep</li>
              <li>Experimenting with recovery ratios relative to training load</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Optimizing the sleep environment—darkness, temperature, quiet, air quality</li>
              <li>Creating spaces that genuinely permit rest</li>
              <li>Reducing light exposure in evening hours</li>
              <li>Considering the sleeping surface and its support</li>
              <li>Establishing boundaries between work spaces and rest spaces</li>
              <li>Creating recovery zones in your living environment</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sleep specialists who investigate sleep architecture beyond duration</li>
              <li>Functional medicine practitioners exploring root causes of impaired regeneration</li>
              <li>Physical therapists who understand recovery physiology</li>
              <li>Nutritional professionals assessing protein and micronutrient status</li>
              <li>Practitioners trained in manual therapies supporting tissue repair</li>
              <li>Practitioners familiar with post-exertional malaise and conditions affecting regeneration</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <p>Simple anchors that may support regeneration:</p>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Consistent sleep timing.</strong> Honor your body&apos;s rhythms—aiming to sleep and wake at similar times most days.</li>
              <li><strong className="text-navy">Adequate sleep duration.</strong> For your individual needs, which may be more than average if regeneration is compromised.</li>
              <li><strong className="text-navy">Movement matched to recovery.</strong> Some form of movement matched to your current recovery capacity.</li>
              <li><strong className="text-navy">Sufficient protein intake.</strong> Distributed across the day to support tissue repair.</li>
              <li><strong className="text-navy">Genuine rest periods.</strong> Not just &quot;less activity&quot; but actual restoration time.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>Rather than optimizing metrics, simply observe:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>How do you feel upon waking?</li>
              <li>How long does post-effort soreness persist?</li>
              <li>How quickly do minor wounds heal?</li>
              <li>What&apos;s your energy trajectory through the day?</li>
              <li>How many hours of sleep leave you feeling restored versus depleted?</li>
              <li>What conditions seem to support better recovery?</li>
            </ul>

            <p className="italic">
              This isn&apos;t data to perfect. It&apos;s information to notice.
            </p>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              Regeneration operates on its own timeline, often slower than we wish. Sleep architecture can take weeks to shift. Tissue quality changes over months. Wound healing speed reflects cumulative factors that don&apos;t reverse overnight.
            </p>

            <p>
              The body&apos;s rebuild capacity can improve, but it does so gradually. Consistency matters more than intensity. Sustainable practices maintained over time will reveal what dramatic interventions cannot.
            </p>

            <p>
              If you&apos;ve been running a regeneration deficit for years, patience with the rebuilding process is part of the practice.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              These questions aren&apos;t diagnostic. They&apos;re invitations to explore what might be originating from your Regeneration System versus another system.
            </p>

            <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Is this about recovering from something or energy to do something? Recovery after exertion, injury, or illness points toward Regeneration. Lack of energy to perform activity may point toward Energy Production.</li>
              <li>Does adequate rest or sleep improve this signal? If rest helps but doesn&apos;t fully restore you to baseline, Regeneration may be involved. If no improvement despite adequate rest, this strongly suggests exploring Regeneration.</li>
              <li>Is there an inflammatory component—swelling, redness, heat, acute pain? If yes, consider the Defense System first. If inflammation has resolved but healing hasn&apos;t completed, Regeneration becomes more likely.</li>
              <li>Does this involve healing or repair taking longer than expected? Extended timelines for wounds, injuries, or illness recovery point toward Regeneration.</li>
              <li>Does this involve tissue quality deterioration? Skin, hair, nails, muscle, or bone thinning, weakening, or degrading suggests Regeneration may be involved.</li>
              <li>Is non-restorative sleep a major factor? Sleep that occurs but doesn&apos;t restore points toward Regeneration. Can&apos;t fall asleep due to racing mind may point toward the Stress System. Waking frequently with hot flashes may involve the Hormonal System.</li>
              <li>Does exertion cause disproportionate or delayed setback? Crashes appearing 12-72 hours after exertion are a classic Regeneration pattern. Immediate exhaustion during activity may point toward Energy Production.</li>
              <li>Does the signal worsen significantly with sleep deprivation? If yes, Regeneration is likely involved, since sleep is the primary repair window.</li>
              <li>Is there a pattern of breaking down faster than building up? Losing tissue or strength despite adequate use and nutrition points toward Regeneration. If hormonal decline is also documented, the Hormonal System may be a co-factor.</li>
              <li>Are multiple regeneration-related signals present together? Signals across categories—sleep, healing, tissue quality, recovery—appearing together suggest systemic Regeneration involvement.</li>
            </ol>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Regeneration System interfaces with multiple other systems. These connections may be worth exploring:
            </p>

            <p>
              <strong className="text-navy">Energy Production System</strong> — Energy is required to power repair processes. Mitochondrial dysfunction affects both energy and regeneration. Fatigue can arise from either system, but regeneration-related fatigue specifically involves recovery not completing despite rest.
            </p>

            <p>
              <strong className="text-navy">Defense System</strong> — Inflammation precedes regeneration; the immune response clears damage, then regeneration rebuilds. Chronic inflammation can impede repair. Slow healing may involve either system depending on whether infection is present.
            </p>

            <p>
              <strong className="text-navy">Hormonal System</strong> — Growth hormone, testosterone, and other hormones signal regeneration processes. Hormonal decline can impair rebuilding capacity. Muscle loss and bone loss may involve both systems.
            </p>

            <p>
              <strong className="text-navy">Stress System</strong> — Chronic stress maintains catabolic (breakdown) states that oppose regeneration. Cortisol elevation impedes repair. Recovery from stress itself requires regeneration. HPA axis dysfunction affects both systems.
            </p>

            <p>
              <strong className="text-navy">Structure &amp; Movement System</strong> — Regeneration repairs the structure. Disuse atrophy is a Structure issue; failure to rebuild after normal use is Regeneration. Stiffness may originate from either, depending on whether it resolves quickly with movement.
            </p>

            <p>
              <strong className="text-navy">Circulation System</strong> — Blood flow delivers regeneration resources to tissues. Poor circulation impairs healing. Slow wound healing may involve either Circulation (delivery problem) or Regeneration (repair process impaired).
            </p>


            <Suspense fallback={null}>
              <SystemDirectory system="Regeneration" label="Regeneration" />
            </Suspense>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your body already knows how to rebuild. The signals that arise when regeneration is compromised aren&apos;t failures—they&apos;re accurate reports from a system working exactly as designed, communicating that the rebuild crew needs different conditions to do its work. Your role is not to override this intelligence but to listen to what it&apos;s telling you.
              </p>
              <p className="mt-4 italic">
                This report is an invitation to explore: not a diagnosis or prescription. Your body&apos;s intelligence has been refined over millions of years. The signals it sends through your regeneration system deserve your curious attention.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/nervous-system"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Nervous System
            </Link>
            <Link
              href="/systems"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors font-medium"
            >
              All Systems
            </Link>
            <Link
              href="/systems/stress-response"
              className="inline-flex items-center gap-2 text-sm text-[#017ab2] hover:text-navy transition-colors font-medium"
            >
              Next: Stress Response
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
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
