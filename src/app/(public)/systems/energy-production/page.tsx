import { ArrowLeft } from "lucide-react"
import Link from "next/link"

/**
 * Energy Production System Page
 *
 * Your Body's Power Grid - mitochondrial function, ATP, metabolic efficiency
 * Part of the bioEDGE Decoder 15 Systems Framework.
 */
export default function EnergyProductionSystemPage() {
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
            Energy Production
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your Body&apos;s Power Grid
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
              Your body produces approximately 70 kilograms of ATP every single day. ATP—adenosine triphosphate—is the universal energy currency that powers every cellular process, from the firing of neurons to the beating of your heart to the healing of a wound.
            </p>

            <p>
              The machinery that makes this possible has been refined over nearly two billion years. Mitochondria, your cellular power plants, began as free-living bacteria that entered into partnership with early cells in an arrangement so successful it became permanent. Every cell in your body (except red blood cells) contains hundreds or thousands of these ancient bacterial descendants, each one carrying its own DNA—DNA passed only from mother to child across millions of generations.
            </p>

            <p>
              <strong className="text-navy">This system is unique among the fourteen because it fuels all the others.</strong> Your Stress Response system requires ATP to mount its defense. Your Defense system requires ATP to produce immune cells. Your Consciousness system requires disproportionate amounts of ATP—the brain, representing only 2% of body weight, consumes 20% of your energy production. When the Energy Production system falters, every other system feels it downstream.
            </p>

            <p>
              The Energy Production system belongs to the psychophysiological supersystem—the unified intelligence network where hormones, nerves, and immune cells speak the same chemical language. Your endocrine system regulates the hormones that govern metabolism. Your nervous system communicates energy demands throughout the body. Your immune system relies on energy to function. They act in concert, without committee meetings or reports.
            </p>

            <p>
              You did not learn how to convert food and oxygen into cellular energy. No one taught your mitochondria how to perform the complex chemical cascades that generate ATP. This knowledge is encoded in your biology, inherited through cellular memory, through the accumulated intelligence of every ancestor who survived.
            </p>

            <p>
              Your body already knows how to power itself. Your job is to remove interference and listen.
            </p>

            {/* Eliminate */}

            <div id="eliminate" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Eliminate
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Identify and remove interference</p>
            </div>

            <p>
              The following are factors worth examining when exploring signals that may relate to energy production. These are not causes or diagnoses—they are considerations.
            </p>

            <h3 className="font-heading font-bold text-navy">Lifestyle Factors</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Activity patterns swinging between sedentary and intense demands</li>
              <li>Sleep that is interrupted, shortened, or poorly timed</li>
              <li>Daily rhythms ignoring circadian preferences</li>
              <li>Schedules leaving no genuine recovery time</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Dietary Considerations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Foods that spike blood sugar followed by crashes</li>
              <li>Erratic meal timing or extended fasting without metabolic flexibility</li>
              <li>Processed foods with poor nutrient density</li>
              <li>Heavy carbohydrate loads without balancing fats and proteins</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Poor air quality or inadequate ventilation</li>
              <li>Lighting that disrupts circadian signaling</li>
              <li>Mold exposure burdening mitochondrial function</li>
              <li>Chronic low-level toxin exposure</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Relationship &amp; Emotional Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Relationships that drain rather than restore</li>
              <li>Suppressed expression creating ongoing internal tension</li>
              <li>Emotional patterns consuming energy without resolution</li>
              <li>Lack of genuine social connection and support</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Habitual Patterns</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Caffeine dependence masking underlying depletion</li>
              <li>Pushing through fatigue signals rather than responding</li>
              <li>Normalizing exhaustion as &quot;just how life is&quot;</li>
              <li>Patterns of overcommitment and inadequate boundaries</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Digital Interference</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Screen time disrupting sleep architecture</li>
              <li>Constant low-level activation from notifications</li>
              <li>Blue light exposure shifting circadian rhythms</li>
              <li>Digital engagement replacing restorative activities</li>
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
              The Energy Production system communicates through 25 signals across 7 categories:
            </p>

            <h4 className="font-heading text-sm font-bold text-navy">Core Fatigue Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Physical exhaustion, deep fatigue</li>
              <li>Post-exertional fatigue, crash after activity</li>
              <li>Unrefreshing sleep, waking tired</li>
              <li>Afternoon crash, energy dip</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Blood Sugar Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Hypoglycemia signals, low blood sugar feelings</li>
              <li>Post-meal fatigue, food coma</li>
              <li>Sugar cravings, carb cravings</li>
              <li>Reactive mood swings related to eating patterns</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Cognitive Energy Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Brain fog related to energy</li>
              <li>Memory problems when depleted</li>
              <li>Slow processing, cognitive sluggishness</li>
              <li>Decision fatigue, difficulty choosing</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Physical Energy Signals (4)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Muscle weakness, loss of strength</li>
              <li>Exercise intolerance, difficulty sustaining activity</li>
              <li>Shortness of breath on exertion</li>
              <li>Cold extremities, poor circulation feeling</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Metabolic Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Unexplained weight changes</li>
              <li>Temperature dysregulation, always cold</li>
              <li>Slow wound healing, poor recovery</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Sleep-Energy Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Excessive need for sleep</li>
              <li>Difficulty waking, morning paralysis feeling</li>
              <li>Waking at night (blood sugar related)</li>
            </ul>

            <h4 className="font-heading text-sm font-bold text-navy">Systemic Energy Signals (3)</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Everything takes too much energy</li>
              <li>Loss of physical resilience</li>
              <li>Caffeine dependence, stimulant need</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">The TRADE Framework</h3>

            <p>
              Between your body&apos;s signal and your response, there&apos;s a gap. Most people don&apos;t know it exists.
            </p>

            <p>
              <strong className="text-navy">T — Trigger:</strong> You notice that familiar afternoon heaviness setting in at 2:30pm. Your eyelids feel weighted. Your thoughts slow. Your body wants to lie down.
            </p>

            <p>
              <strong className="text-navy">R — React:</strong> Your body responds—perhaps with a yawn, a stretch toward the coffee pot, a reaching for something sweet. Energy dips, and compensation begins.
            </p>

            <p>
              <strong className="text-navy">A — Assume:</strong> &quot;I didn&apos;t sleep enough last night.&quot; &quot;I&apos;m getting older.&quot; &quot;I&apos;m just lazy.&quot; &quot;Everyone gets tired in the afternoon.&quot; &quot;I need more willpower.&quot; &quot;There&apos;s something wrong with me.&quot;
            </p>

            <p>
              <em>Most people live in a loop of T, R, and A. Trigger, react, assume. Trigger, react, assume. The assumption becomes reality, and you end up in a <strong>TRAP</strong>, paralyzed.</em>
            </p>

            <p>
              <strong className="text-navy">D — Decode:</strong> What did I eat for lunch, and how quickly did this crash follow the meal? What was my blood sugar doing before and after? Did this happen yesterday at the same time? Does this correlate with carbohydrate intake? Does caffeine temporarily fix this, or does it just delay a bigger crash?
            </p>

            <p>
              <strong className="text-navy">E — Encode:</strong> Next time the afternoon heaviness arrives, you remember: &quot;This is information. My body is reporting on fuel status. I can investigate what&apos;s driving this pattern rather than reaching for the quick fix.&quot;
            </p>

            <p>
              Investigating takes courage. When you question a story that feels true, you gain more agency over your entire life. This doesn&apos;t stop with your health. This can apply to your career, your family, your friends, anything.
            </p>

            <h3 className="font-heading font-bold text-navy">Common Mislabels</h3>

            <p>
              Energy signals are frequently attributed to other causes. The following patterns may be worth exploring:
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
                    <td className="py-3 pr-4">Laziness</td>
                    <td className="py-3">Cellular energy production that may be insufficient for demand</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Depression</td>
                    <td className="py-3">Whether fatigue patterns correlate with food, rest, and sleep</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Normal aging&quot;</td>
                    <td className="py-3">Whether age-related decline may reflect accumulated interference</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Just tired&quot;</td>
                    <td className="py-3">Whether fatigue has patterns worth investigating</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Being out of shape</td>
                    <td className="py-3">Post-exertional crash patterns indicating more than deconditioning</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Anxiety disorder</td>
                    <td className="py-3">Blood sugar instability creating anxiety-like sensations</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Panic attacks</td>
                    <td className="py-3">Hypoglycemia signals that mimic panic</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">ADHD</td>
                    <td className="py-3">Brain fog patterns that correlate with energy state</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Early dementia</td>
                    <td className="py-3">Memory issues that improve with food and rest</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Lack of willpower</td>
                    <td className="py-3">Decision fatigue from depleted glucose reserves</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Mood disorder</td>
                    <td className="py-3">Reactive mood swings tied to eating patterns</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">&quot;Not a morning person&quot;</td>
                    <td className="py-3">Unrefreshing sleep and morning paralysis patterns</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4">Hypochondria</td>
                    <td className="py-3">Real metabolic signals being dismissed</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Poor sleep hygiene</td>
                    <td className="py-3">Sleep that occurs but fails to restore energy</td>
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
              The following are options to explore—not prescriptions. Different approaches work for different people.
            </p>

            <h3 className="font-heading font-bold text-navy">Awareness Tools</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Notice what times of day energy peaks and dips</li>
              <li>Observe relationship between food and how you feel 30 min, 2 hrs, 4 hrs later</li>
              <li>Track whether signals improve with food, rest, or sleep</li>
              <li>Notice if fatigue is &quot;tired&quot; or &quot;wired and tired&quot;</li>
              <li>Observe difference between physical fatigue and emotional exhaustion</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Exploratory Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Experiment with meal composition (reduce carbs, add protein/fat)</li>
              <li>Try different meal timing patterns</li>
              <li>Explore whether a short walk affects afternoon energy vs caffeine</li>
              <li>Investigate what genuine rest feels like vs distraction</li>
              <li>Notice what happens with an earlier bedtime for a week</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Environmental Adjustments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Examine lighting, particularly morning light exposure</li>
              <li>Investigate air quality in primary spaces</li>
              <li>Review sleep environment (temperature, darkness, disruptions)</li>
              <li>Consider whether spaces support or drain energy</li>
              <li>Look at toxin exposure from household sources</li>
            </ul>

            <h3 className="font-heading font-bold text-navy">Professional Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Functional medicine practitioners (root causes)</li>
              <li>Endocrinologists (hormonal contributions)</li>
              <li>Nutritionists (dietary patterns)</li>
              <li>Naturopathic doctors (lifestyle factors)</li>
              <li>Testing: metabolic panels, thyroid markers, fasting insulin, HbA1c, organic acids</li>
            </ul>

            {/* Execute */}

            <div id="execute" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Execute
              </h2>
              <p className="text-sm font-heading mt-1" style={{ color: "#0d598a" }}>Take action with patience and consistency</p>
            </div>

            <h3 className="font-heading font-bold text-navy">Foundation Practices</h3>

            <p>Simple anchors that may support energy awareness:</p>

            <ol className="list-decimal pl-6 space-y-3">
              <li><strong className="text-navy">Consistent meal timing.</strong> Eating meals at regular times helps regulate blood sugar and energy patterns.</li>
              <li><strong className="text-navy">Balance macronutrients.</strong> Include protein and fat with carbohydrates to moderate blood sugar response.</li>
              <li><strong className="text-navy">Morning light.</strong> Get light exposure within an hour of waking to support circadian rhythm.</li>
              <li><strong className="text-navy">Consistent sleep window.</strong> Go to bed and wake at similar times to regulate energy production.</li>
              <li><strong className="text-navy">Movement breaks.</strong> Brief movement throughout the day supports energy regulation.</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Tracking What You Notice</h3>

            <p>Rather than optimizing metrics, simply observe:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>What time of day does energy feel best? Worst?</li>
              <li>What foods precede energy crashes? What foods sustain?</li>
              <li>Does caffeine help, delay, or make things worse?</li>
              <li>How many hours of sleep leaves you feeling restored?</li>
              <li>Does rest actually help, or does fatigue persist regardless?</li>
            </ul>

            <p className="text-sm italic">
              These observations are data, not judgments. They reveal patterns worth exploring.
            </p>

            <h3 className="font-heading font-bold text-navy">The Patience Principle</h3>

            <p>
              The Energy Production system reflects accumulated patterns—mitochondrial health builds over time, blood sugar regulation stabilizes gradually, cellular repair happens during consistent recovery. Changes may take weeks to months to become apparent.
            </p>

            <p>
              This system responds to consistency over intensity. Sustainable rhythms matter more than dramatic interventions.
            </p>

            <p>
              The body stores energy differently than a bank account. You cannot deposit frantically on weekends and withdraw all week. Restoration requires regularity.
            </p>

            {/* Questions for Clarity */}

            <div id="questions" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Questions for Clarity
              </h2>
            </div>

            <p>
              These questions may help explore whether a signal originates primarily from the Energy Production system:
            </p>

            <h3 className="font-heading font-bold text-navy">Core Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Does this improve with rest, food, or sleep? (If yes → Energy)</li>
              <li>Is there a blood sugar component—correlates with eating patterns?</li>
              <li>Does this have a &quot;tired&quot; quality, or &quot;wired and tired&quot;?</li>
              <li>Does caffeine provide temporary relief then crash?</li>
              <li>Does physical exertion cause disproportionate or delayed fatigue?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Self-Inquiry</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>When did I last feel genuinely energized, and what was different?</li>
              <li>What happens when I eat differently—more protein, fewer carbs?</li>
              <li>Does genuine rest (not distraction) change how I feel?</li>
              <li>Am I borrowing energy from tomorrow with caffeine or willpower?</li>
              <li>Do I push through fatigue signals, and what happens when I don&apos;t?</li>
            </ol>

            <h3 className="font-heading font-bold text-navy">Distinguishing Overlaps</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-navy">Pure tiredness</strong> → points to Energy Production</li>
              <li><strong className="text-navy">&quot;Wired and tired&quot;</strong> → may involve Stress Response</li>
              <li><strong className="text-navy">Caffeine makes it worse</strong> → may indicate Stress Response</li>
              <li><strong className="text-navy">Crash 24-72 hours after activity</strong> → may indicate mitochondrial involvement</li>
              <li><strong className="text-navy">Body and brain sluggish together</strong> → suggests ATP affecting everything</li>
              <li><strong className="text-navy">Fatigue persists regardless of rest</strong> → consider other systems</li>
            </ul>

            {/* Cross-System Connections */}

            <div id="connections" className="border-l-4 pl-6 py-2 scroll-mt-16" style={{ borderColor: "#0d2840" }}>
              <h2 className="font-heading font-bold text-2xl text-navy">
                Cross-System Connections
              </h2>
            </div>

            <p>
              The Energy Production system fuels all other systems and interfaces with them constantly:
            </p>

            <p>
              <strong className="text-navy">Stress Response System</strong> — Energy depletion and stress activation often occur together. The &quot;wired and tired&quot; pattern involves both systems. Chronic stress burns through energy reserves while preventing restoration.
            </p>

            <p>
              <strong className="text-navy">Hormonal System</strong> — Thyroid hormones regulate metabolic rate and thus energy production. Adrenal hormones affect blood sugar regulation. The two systems share signals and require consideration together.
            </p>

            <p>
              <strong className="text-navy">Defense System</strong> — Inflammation consumes significant energy. Chronic immune activation drains resources. Fatigue accompanied by inflammatory signals may involve both systems.
            </p>

            <p>
              <strong className="text-navy">Consciousness System</strong> — The brain requires disproportionate ATP. Cognitive signals often appear first when energy production falters. Distinguishing energy-related brain fog from consciousness-related processing requires observing whether food and rest help.
            </p>

            <p>
              <strong className="text-navy">Regeneration System</strong> — Sleep is when cellular repair occurs. Unrefreshing sleep impairs both regeneration and energy restoration. The two systems interface during recovery.
            </p>

            <p>
              <strong className="text-navy">Digestive System</strong> — Energy comes from food. Digestive function affects nutrient absorption and blood sugar patterns. Post-meal fatigue may involve both systems.
            </p>

            {/* Closing */}

            <div className="border-t border-border pt-10 mt-10">
              <p>
                Your body produces approximately 70 kilograms of ATP every single day. This ancient machinery has been refined over nearly two billion years. You did not learn how to power yourself—this wisdom is encoded in your biology.
              </p>
              <p className="mt-4 italic">
                The signals your body sends are communications worth investigating, not conclusions to accept. Your body&apos;s natural intelligence is already working. Your role is to listen, decode, and respond.
              </p>
            </div>

          </article>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-12">
            <Link
              href="/systems/emotional"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous: Emotional
            </Link>
            <Link
              href="/systems/hormonal"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-pink-accent transition-colors font-medium"
            >
              Next: Hormonal
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const metadata = {
  title: "Energy Production | bioEDGE Decoder",
  description: "Your Body's Power Grid. The Energy Production system governs mitochondrial function and ATP production—fueling all other systems with the universal energy currency that powers every cellular process.",
}
